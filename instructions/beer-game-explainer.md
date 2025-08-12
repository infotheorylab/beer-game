# Beer Distribution Game — Explainer (for Website & LLM Agents)

> **Key takeaway:** Small, local decisions made with **limited information** and **non‑zero lead times** can create large, costly oscillations in orders and inventory. This is the **Bullwhip Effect**. 

## What the Beer Game Is
The Beer Distribution Game (BDG) is a four‑stage supply‑chain simulation with one role at each stage: **Retailer → Wholesaler → Distributor → Factory**. Each role manages local inventory/backlog, ships to its immediate downstream partner, and places replenishment orders upstream (the factory produces to order). The joint objective is to **minimize total supply‑chain cost** (inventory holding + backlog costs) over the horizon. :contentReference[oaicite:0]{index=0}

### Why this matters for our site
Our site uses this game to show **how information asymmetry and delays drive the Bullwhip Effect** and to test mitigation levers (e.g., demand visibility, shorter lead times). It’s simple enough to understand quickly, yet rich enough to reveal core system dynamics. :contentReference[oaicite:1]{index=1}

## Core Dynamics You Must Model
**State observed each week (per role):**
- On‑hand inventory and backlog
- Incoming shipment(s) due to arrive (pipeline inventory)
- Incoming order from the next downstream role
- Any shared information allowed by the scenario (e.g., point‑of‑sale demand)

**Decision each week (per role):**
- Place a single replenishment order to the immediate upstream partner (the factory places a production order). Orders are non‑negative integers.

**Sequence of events within a week (per role):**
1) Receive shipment from upstream (or completed production at the factory).  
2) Receive and try to fulfill the downstream order from on‑hand inventory; unmet demand becomes backlog.  
3) System advances pipeline shipments (and production) automatically.  
4) Place next order upstream.  
5) Costs post for the week (inventory holding + backlog).  
Default costs in our simulator: **$0.50 per unit per week** for inventory, **$1.00 per unit per week** for backlog. :contentReference[oaicite:2]{index=2}

**Information asymmetry (default):**
- Only the **Retailer** sees the end‑customer (point‑of‑sale, PoS) demand. Upstream roles see only the orders placed by their immediate customer. (Scenarios can relax this; see below.) :contentReference[oaicite:3]{index=3}

**Delays / Lead times (default):**
- **Order processing delay:** 2 weeks (an order placed today is *seen* by upstream two weeks later).  
- **Shipment (transport) delay:** 2 weeks.  
- Effective time from placing an order to receiving the resulting shipment is typically **4+ weeks** (longer if upstream is stocked out). These delays are central to the game’s behavior. :contentReference[oaicite:4]{index=4}

## The Bullwhip Effect (the core lesson)
**Definition.** As you move upstream (Retailer → Wholesaler → Distributor → Factory), the **variation of orders and inventory grows**, even when customer demand is relatively stable. The result is large swings in backlog followed by gluts of inventory, driving high cost and poor service. :contentReference[oaicite:5]{index=5}

**Primary drivers to highlight on the site:**
1) **Information delay & distortion.** Upstream roles forecast from **orders**, not true demand. With multi‑week delays and partial visibility, they overreact.  
2) **Order batching.** To “be efficient,” roles place infrequent, larger orders—amplifying variability.  
3) **Price fluctuations / promotions.** Forward buying leads to spikes unrelated to true demand.  
4) **Shortage gaming.** Anticipated rationing causes inflated orders, then demand collapses later.  
These are the standard four causes used to teach the BDG; our scenarios let users explore fixes for each. :contentReference[oaicite:6]{index=6}

**What users should see in the charts:**
- **Oscillation:** inventory plunges → backlog spikes → “panic” orders → later excess inventory.  
- **Amplification:** peaks and troughs grow larger upstream.  
- **Lag:** each upstream stage peaks several weeks after its downstream partner. :contentReference[oaicite:7]{index=7}

## LLM‑Powered Version (how agents play)
In our simulator, **each role is controlled by an autonomous LLM agent**. On every week \(t\), an agent receives its local state (inventory, backlog, incoming order, pipeline, any shared signals) and outputs an integer order quantity for its upstream. The environment enforces the delays, material balance, and costs. :contentReference[oaicite:8]{index=8}

**Agent I/O contract (per week):**
- **Inputs:** role name; week index; on‑hand inventory; backlog; incoming order; pipeline vector (shipments due by week); cost parameters; scenario flags (e.g., visibility); optional past window (e.g., last 6 weeks).  
- **Output:** `order_quantity` \(≥ 0, integer\).  
- **Constraints:** no peeking at hidden data; no cross‑role messaging unless the scenario permits it.


## Potential Scenarios to Include (for learning)
Each scenario toggles one or more drivers/mitigations of the bullwhip.

1) **Default (asymmetric info + long delays).** Only retailer sees PoS demand; **2w order delay + 2w ship delay**; standard costs. Expect strong bullwhip. :contentReference[oaicite:9]{index=9}  
2) **Demand visibility.** Share PoS demand with all roles (and optionally a short rolling history). Expect reduced amplification and lag. :contentReference[oaicite:10]{index=10}  
3) **Shorter lead times.** Reduce processing and/or shipment delays (e.g., 1w + 1w). Expect smaller swings and lower total cost. :contentReference[oaicite:11]{index=11}  
4) **Order batching on/off.** Force weekly ordering vs. allow periodic batching; visualize impact. :contentReference[oaicite:12]{index=12}  
5) **Promotions on/off.** Inject temporary wholesale price drops; show forward buying and post‑promo slumps. :contentReference[oaicite:13]{index=13}  
6) **Shortage gaming.** Introduce capacity/rationing; let agents decide whether to inflate orders; compare to “allocate‑by‑sales” remedy. :contentReference[oaicite:14]{index=14}

## What to Visualize
- **Time series (per role):** orders placed, shipments received, inventory & backlog, cumulative costs.  Mock visualization in /drafts/draft1.html.
- **Bullwhip metric:** variance (or standard deviation) of **orders** per role; show ratios vs. customer demand.  
- **Lag & amplification:** mark peaks; annotate delays between roles.  
- **Cost breakdown:** inventory vs. backlog by week and cumulatively.  
- **Scenario overlays:** run A/B comparisons (e.g., default vs. demand‑visibility) on the same axes. :contentReference[oaicite:15]{index=15}

## Copy for the Website (concise user‑facing text)
**Play the Beer Game.** Four links in a beer supply chain try to serve customers while minimizing cost. With **limited information** and **multi‑week lead times**, small demand changes ripple upstream into **big swings**—the **Bullwhip Effect**. Toggle visibility and lead times to see what stabilizes the chain.

**How to use this page:**  
1) Choose a scenario (visibility, lead times, promotions).  
2) Click **Run Simulation**—our agents play all four roles.  
3) Explore the charts: watch oscillations shrink when you share demand and cut delays.

## Glossary
- **Backlog:** Unfilled orders carried forward; penalized each week until shipped.  
- **Pipeline inventory:** Units already ordered/produced but not yet arrived.  
- **Base‑stock policy:** Target total inventory (on‑hand + pipeline) equal to expected lead‑time demand.  
- **Bullwhip Effect:** Upstream order variability > downstream demand variability; grows with poor information and long delays. :contentReference[oaicite:16]{index=16}

---

### Implementation Notes for the Builder LLM
- Keep all **numbers configurable**; defaults as listed above.  
- Enforce integer, non‑negative orders; no back‑orders are lost—everything is eventually filled.  
- The environment, not agents, should manage the accounting of delays and costs.  
- Log a tidy weekly table: `week, role, order, shipment_in, shipment_out, inventory, backlog, pipeline_total, inv_cost, backlog_cost, cum_cost`.  
- Provide a simple API to register agent policies by role and to run N replications for variability bands.
