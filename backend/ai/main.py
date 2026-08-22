import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Gullak Agentic AI Server",
    description="LangChain-based multi-agent personal finance advisor",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class GoalItem(BaseModel):
    title: str
    targetAmount: float
    currentAmount: float
    targetDate: str

class PortfolioSummary(BaseModel):
    totalInvested: float
    currentValue: float
    totalReturns: float
    returnPercentage: float

class ChatRequest(BaseModel):
    message: str
    userId: str
    riskProfile: Optional[str] = "moderate"
    portfolio: Optional[PortfolioSummary] = None
    goals: Optional[List[GoalItem]] = []

class ChatResponse(BaseModel):
    success: bool
    response: str
    agentUsed: str
    suggestedActions: List[str]

# Rule-based fallback engine for when OPENAI_API_KEY is not defined
def get_rule_based_response(query: str, risk: Optional[str], portfolio: Optional[PortfolioSummary], goals: Optional[List[GoalItem]]) -> Dict[str, Any]:
    query_lower = query.lower()
    response_text = ""
    suggested = []
    risk_str = risk or "moderate"
    goals_list = goals or []
    
    # 1. Welcome intent
    if any(w in query_lower for w in ["hi", "hello", "hey", "gullak"]):
        response_text = f"Hello! I am your Gullak AI Advisor. Based on your {risk_str} risk profile, I can help you optimize your portfolio, suggest goal contributions, or explain financial concepts. What's on your mind today?"
        suggested = ["Show my returns summary", "Am I on track for my goals?", "Explain mutual funds"]
        
    # 2. Portfolio query
    elif any(p in query_lower for p in ["portfolio", "returns", "invested", "investment", "money"]):
        if portfolio and portfolio.totalInvested > 0:
            response_text = f"Your portfolio is looking healthy! You have invested a total of ₹{portfolio.totalInvested:,.2f}, which is currently valued at ₹{portfolio.currentValue:,.2f}. This represents a return of ₹{portfolio.totalReturns:,.2f} ({portfolio.returnPercentage:.1f}%). Given your {risk_str} profile, I suggest keeping 60% in Nifty Index Funds, 30% in Digital Gold, and 10% in Corporate Bonds."
        else:
            response_text = "You haven't started investing yet! Gullak makes it easy to begin with as little as ₹10 through automatic spare-change round-ups. Your moderate risk profile is ideal for starting with balanced index funds."
        suggested = ["How do round-ups work?", "Set up an auto-invest rule"]
        
    # 3. Goal queries
    elif any(g in query_lower for g in ["goal", "target", "iphone", "vacation", "save"]):
        if goals_list:
            active_goals = ", ".join([f"'{g.title}' (₹{g.currentAmount} saved of ₹{g.targetAmount})" for g in goals_list])
            response_text = f"I see you are saving for: {active_goals}. To reach these targets faster, I suggest setting up a weekly Auto-Contribute of ₹100. Based on your spending, you can easily save an extra ₹400/month by enabling the Auto Round-up agent!"
        else:
            response_text = "You don't have any active savings goals right now. Creating a goal (like a travel fund or buying a gadget) helps the Gullak AI allocate your spare change effectively. Would you like to create one?"
        suggested = ["Create a new goal", "What are suggested goals for Gen-Z?"]
        
    # 4. Learning/Concept query
    elif any(c in query_lower for c in ["explain", "what is", "mutual fund", "gold", "bond", "inflation"]):
        if "gold" in query_lower:
            response_text = "Digital Gold on Gullak allows you to buy 24k physical gold in micro-amounts (starting at ₹10). It is backed by physical vaults and acts as a safe-haven hedge against equity market volatility, which aligns perfectly with your asset allocation strategy."
        elif "bond" in query_lower:
            response_text = "Bonds are debt instruments where you lend money to governments or corporations in exchange for fixed interest payments. They are lower risk than equities and provide steady stability to your portfolio."
        else:
            response_text = "Mutual Funds pool money from multiple investors to buy a diversified basket of stocks or bonds. For Gen-Z, low-cost index funds are the best starting point because they track the top 50 Indian companies (Nifty 50) with very low fees."
        suggested = ["Start Level 1 Quiz", "Read module on compound interest"]
        
    # 5. Default
    else:
        response_text = f"Interesting question! Under your {risk_str} risk profile, my main recommendation is to maintain disciplined micro-savings. Saving just ₹20 daily through round-ups adds up to ₹7,300/year, compounding at an average of 12% in index funds. How else can I assist your financial journey?"
        suggested = ["Show my returns summary", "Explain Digital Gold"]
        
    return {
        "response": response_text,
        "agent": "Rule-Based Expert Agent",
        "suggestedActions": suggested
    }

@app.post("/api/ai/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    openai_key = os.getenv("OPENAI_API_KEY")
    
    # If API key is available, we would boot LangChain
    if openai_key:
        try:
            from langchain_openai import ChatOpenAI
            from langchain.prompts import ChatPromptTemplate
            
            prompt = ChatPromptTemplate.from_messages([
                ("system", (
                    "You are the Gullak AI Advisor, a premium, intelligent, and friendly personal finance coach for Gen-Z. "
                    "The user has a {risk} risk profile. "
                    "Their current portfolio consists of: Total Invested: ₹{invested}, Current Value: ₹{val}, Returns: ₹{ret} ({pct}%). "
                    "Their savings goals are: {goals_desc}. "
                    "Be encouraging, explain financial jargon simply, suggest micro-savings like round-ups, and keep answers concise."
                )),
                ("user", "{user_message}")
            ])
            
            model = ChatOpenAI(model="gpt-4o", temperature=0.7, openai_api_key=openai_key)
            chain = prompt | model
            
            goals_text = ", ".join([f"{g.title} (₹{g.currentAmount}/₹{g.targetAmount})" for g in request.goals]) if request.goals else "None"
            portfolio_summary = request.portfolio or PortfolioSummary(totalInvested=0, currentValue=0, totalReturns=0, returnPercentage=0)
            
            res = await chain.ainvoke({
                "risk": request.riskProfile,
                "invested": portfolio_summary.totalInvested,
                "val": portfolio_summary.currentValue,
                "ret": portfolio_summary.totalReturns,
                "pct": portfolio_summary.returnPercentage,
                "goals_desc": goals_text,
                "user_message": request.message
            })
            
            # Simple keyword matching to suggest actions dynamically
            actions = ["Show my returns summary"]
            if "goal" in request.message.lower():
                actions.append("Am I on track for my goals?")
            else:
                actions.append("Explain mutual funds")
                
            return ChatResponse(
                success=True,
                response=res.content,
                agentUsed="LangChain GPT-4o Agent",
                suggestedActions=actions
            )
            
        except Exception as e:
            # Fallback if LangChain initialization errors out
            fallback = get_rule_based_response(request.message, request.riskProfile, request.portfolio, request.goals)
            return ChatResponse(
                success=True,
                response=fallback["response"],
                agentUsed=f"Rule-Based Expert Agent (LangChain Failover: {str(e)})",
                suggestedActions=fallback["suggestedActions"]
            )
            
    # Default failover if no OpenAI Key is defined
    fallback = get_rule_based_response(request.message, request.riskProfile, request.portfolio, request.goals)
    return ChatResponse(
        success=True,
        response=fallback["response"],
        agentUsed=fallback["agent"],
        suggestedActions=fallback["suggestedActions"]
    )

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Gullak Agentic AI Server",
        "engine": "FastAPI + LangChain Community"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
