import os
import sys
import json
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv

# Force UTF-8 output on Windows
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run Gemini init in background so the server starts immediately."""
    if os.getenv("GEMINI_API_KEY"):
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _init_gemini)
    else:
        print("[Gemini] No API key — rule-based fallback active.", flush=True)
    yield  # server is running


app = FastAPI(
    title="Gullak Agentic AI Server",
    description="Gemini-powered multi-agent personal finance advisor",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Data models
# ---------------------------------------------------------------------------
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

class TransactionItem(BaseModel):
    amount: float
    merchant: str
    category: Optional[str] = "other"
    date: str

class SpendingAnalysisRequest(BaseModel):
    userId: str
    transactions: List[TransactionItem]
    riskProfile: Optional[str] = "moderate"

# ---------------------------------------------------------------------------
# Gemini client — uses interactions.create() API (genai.Client reads env key)
# ---------------------------------------------------------------------------
GEMINI_MODEL = "gemini-3.7-flash"
_gemini_client = None


def _init_gemini():
    """Initialise the Gemini client. No smoke test — just create the client."""
    global _gemini_client
    try:
        from google import genai
        # genai.Client() reads GEMINI_API_KEY from environment automatically
        _gemini_client = genai.Client()
        print(f"[Gemini] Ready — using {GEMINI_MODEL}", flush=True)
        return True
    except Exception as e:
        print(f"[Gemini] Init failed: {e}", flush=True)
        _gemini_client = None
        return False


def gemini_generate(prompt: str, max_tokens: int = 512) -> str:
    """Generate text via interactions.create()."""
    interaction = _gemini_client.interactions.create(
        model=GEMINI_MODEL,
        input=prompt,
    )
    return interaction.output_text.strip()


def is_gemini_ready() -> bool:
    return _gemini_client is not None


# Initialise will run in FastAPI lifespan (see above)



# ---------------------------------------------------------------------------
# Rule-based fallback (no API key needed)
# ---------------------------------------------------------------------------
def get_rule_based_response(
    query: str,
    risk: Optional[str],
    portfolio: Optional[PortfolioSummary],
    goals: Optional[List[GoalItem]]
) -> Dict[str, Any]:
    query_lower = query.lower()
    risk_str = risk or "moderate"
    goals_list = goals or []

    if any(w in query_lower for w in ["hi", "hello", "hey", "gullak"]):
        return {
            "response": f"Hello! I'm your Gullak AI Advisor powered by Gemini 🪙\nBased on your **{risk_str}** risk profile, I can help you optimise round-ups, plan goals, and make smarter micro-investments. What's on your mind?",
            "agent": "Rule-Based Expert Agent",
            "suggestedActions": ["How are my investments doing?", "Explain round-ups", "Best goal for me?"]
        }

    if any(p in query_lower for p in ["round", "spare", "change", "sms", "upi"]):
        return {
            "response": "Round-ups are the magic of Gullak! 🪄\nEvery time you spend (say ₹26), the app rounds up to ₹30 and saves the ₹4 difference. These micro-savings accumulate in your vault. Once you cross ₹50, you can invest in **Nifty Index Funds** or **Digital Gold** with one tap!",
            "agent": "Rule-Based Expert Agent",
            "suggestedActions": ["Enable SMS parsing", "See my pending round-ups", "How do I invest from vault?"]
        }

    if any(p in query_lower for p in ["portfolio", "returns", "invested", "investment", "money"]):
        if portfolio and portfolio.totalInvested > 0:
            response = (
                f"Your portfolio is looking healthy! 📈\n"
                f"Total invested: ₹{portfolio.totalInvested:,.2f}\n"
                f"Current value: ₹{portfolio.currentValue:,.2f}\n"
                f"Returns: ₹{portfolio.totalReturns:,.2f} ({portfolio.returnPercentage:.1f}%)\n\n"
                f"For your **{risk_str}** profile, I suggest: 60% Nifty Index Funds · 30% Digital Gold · 10% Bonds."
            )
        else:
            response = "You haven't started investing yet! Gullak makes it easy to begin with ₹10 through automatic spare-change round-ups. Your moderate risk profile is ideal for starting with balanced index funds. 🚀"
        return {"response": response, "agent": "Rule-Based Expert Agent", "suggestedActions": ["How do round-ups work?", "Set up auto-invest"]}

    if any(g in query_lower for g in ["goal", "target", "iphone", "vacation", "save"]):
        if goals_list:
            active = ", ".join([f"'{g.title}' (₹{g.currentAmount:.0f}/₹{g.targetAmount:.0f})" for g in goals_list])
            response = f"I see you're saving for: {active}. 🎯\nTo reach these faster, enable Auto Round-ups and a weekly contribution of ₹100. Based on your spending, you can save an extra ₹400/month!"
        else:
            response = "You don't have any active savings goals yet. Creating a goal (travel, gadgets, emergency) helps Gullak allocate your spare change smartly. Would you like to create one? 🎯"
        return {"response": response, "agent": "Rule-Based Expert Agent", "suggestedActions": ["Create a new goal", "Suggested goals for Gen-Z"]}

    if any(c in query_lower for c in ["explain", "what is", "mutual fund", "gold", "bond", "inflation"]):
        if "gold" in query_lower:
            response = "Digital Gold on Gullak lets you buy 24k physical gold in micro-amounts (starting at ₹1!). It's backed by physical vaults (MMTC-PAMP), price-tracks actual gold, and acts as an inflation hedge. Perfect for spare-change investing! ✨"
        elif "bond" in query_lower:
            response = "Bonds are debt instruments — you lend money to governments/corporations for fixed interest. They're lower risk than stocks and provide steady stability to your portfolio."
        else:
            response = "Mutual Funds pool money from investors to buy diversified stocks or bonds. For Gen-Z, **low-cost Nifty 50 index funds** are ideal — they track India's top 50 companies with very low fees (~0.1% expense ratio). 📊"
        return {"response": response, "agent": "Rule-Based Expert Agent", "suggestedActions": ["Start investing", "See asset allocation"]}

    return {
        "response": f"Great question! Under your **{risk_str}** profile, disciplined micro-savings are key. Saving just ₹20 daily via round-ups = ₹7,300/year, compounding at ~12% in index funds over 10 years = ₹13,000+! How can I help your financial journey? 💰",
        "agent": "Rule-Based Expert Agent",
        "suggestedActions": ["Show my returns", "Explain Digital Gold"]
    }

# ---------------------------------------------------------------------------
# POST /api/ai/chat — Main chat endpoint
# ---------------------------------------------------------------------------
@app.post("/api/ai/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if is_gemini_ready():
        try:
            goals_text = (
                ", ".join([f"{g.title} (\u20b9{g.currentAmount:.0f}/\u20b9{g.targetAmount:.0f})" for g in request.goals])
                if request.goals else "None"
            )
            portfolio_snapshot = request.portfolio

            system_prompt = (
                f"You are Gullak AI - a friendly, intelligent personal finance coach for Gen-Z Indians. "
                f"The user has a {request.riskProfile} risk profile. "
                f"Portfolio: Invested Rs {portfolio_snapshot.totalInvested if portfolio_snapshot else 0:,.2f}, "
                f"Current Value Rs {portfolio_snapshot.currentValue if portfolio_snapshot else 0:,.2f}, "
                f"Returns {portfolio_snapshot.returnPercentage if portfolio_snapshot else 0:.1f}%. "
                f"Savings goals: {goals_text}. "
                f"Core product: round-up micro-investing (every spend rounded up to Rs 10, spare change invested in Nifty Index Funds or Digital Gold). "
                f"Be concise (max 3-4 sentences), encouraging, use INR, avoid jargon, suggest actionable next steps. "
                f"Use emojis sparingly. Never mention OpenAI or GPT."
            )

            full_prompt = f"{system_prompt}\n\nUser: {request.message}\nGullak AI:"
            ai_text = gemini_generate(full_prompt)

            actions = ["Show my portfolio"]
            msg_lower = request.message.lower()
            if "goal" in msg_lower:
                actions.append("Am I on track for my goals?")
            elif "round" in msg_lower or "sms" in msg_lower:
                actions.append("See my pending round-ups")
            else:
                actions.append("How do round-ups work?")

            return ChatResponse(
                success=True,
                response=ai_text,
                agentUsed=f"Gemini ({GEMINI_MODEL})",
                suggestedActions=actions
            )

        except Exception as e:
            print(f"[Gemini] Chat error: {e}", flush=True)
            fallback = get_rule_based_response(request.message, request.riskProfile, request.portfolio, request.goals)
            return ChatResponse(
                success=True,
                response=fallback["response"],
                agentUsed=f"Rule-Based Agent (Gemini failover)",
                suggestedActions=fallback["suggestedActions"]
            )

    # No Gemini - use rule-based
    fallback = get_rule_based_response(request.message, request.riskProfile, request.portfolio, request.goals)
    return ChatResponse(
        success=True,
        response=fallback["response"],
        agentUsed=fallback["agent"],
        suggestedActions=fallback["suggestedActions"]
    )

# ---------------------------------------------------------------------------
# POST /api/ai/spending-analysis
# Gemini analyses 30-day transaction data and returns structured insights
# ---------------------------------------------------------------------------
@app.post("/api/ai/spending-analysis")
async def spending_analysis(request: SpendingAnalysisRequest):
    if not request.transactions:
        return {"success": True, "data": {"insights": "No transaction data available yet. Keep using the app and I'll analyse your spending patterns! 📊", "topMerchant": None, "topCategory": None, "savingOpportunity": None}}

    # Build summary for Gemini
    total_spent = sum(t.amount for t in request.transactions)
    merchant_totals: Dict[str, float] = {}
    category_totals: Dict[str, float] = {}

    for t in request.transactions:
        merchant_totals[t.merchant] = merchant_totals.get(t.merchant, 0) + t.amount
        category_totals[t.category or "other"] = category_totals.get(t.category or "other", 0) + t.amount

    top_merchant = max(merchant_totals, key=merchant_totals.get) if merchant_totals else None
    top_category = max(category_totals, key=category_totals.get) if category_totals else None
    top_merchant_amount = merchant_totals.get(top_merchant, 0) if top_merchant else 0

    if is_gemini_ready():
        try:
            prompt = (
                f"A user spent Rs {total_spent:.0f} across {len(request.transactions)} transactions this month. "
                f"Top merchant: {top_merchant} (Rs {top_merchant_amount:.0f}). "
                f"Top category: {top_category}. "
                f"Risk profile: {request.riskProfile}. "
                f"In 2 short sentences max: give one specific saving tip and one encouraging micro-investment insight. "
                f"Use Rs currency. Be friendly and Gen-Z appropriate."
            )
            insight_text = gemini_generate(prompt, max_tokens=200)
        except Exception as e:
            insight_text = f"You spent Rs {total_spent:.0f} this month. Your biggest expense was {top_merchant} - try cutting 10% there to boost your investment vault!"
    else:
        insight_text = f"You spent ₹{total_spent:.0f} this month. Your top merchant is {top_merchant or 'unknown'} — small cuts there could add ₹{max(top_merchant_amount*0.1, 50):.0f}/month to your savings! 💡"

    return {
        "success": True,
        "data": {
            "insights": insight_text,
            "totalSpent": total_spent,
            "topMerchant": top_merchant,
            "topMerchantAmount": top_merchant_amount,
            "topCategory": top_category,
            "transactionCount": len(request.transactions),
        }
    }

# ---------------------------------------------------------------------------
# GET / — Health check
# ---------------------------------------------------------------------------
@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Gullak Agentic AI Server",
        "engine": f"FastAPI + {GEMINI_MODEL or 'Rule-Based'}",
        "geminiConfigured": bool(os.getenv("GEMINI_API_KEY")),
        "geminiModel": GEMINI_MODEL,
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
