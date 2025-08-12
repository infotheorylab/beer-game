## Main Text

The LLM-Powered Beer Distribution Game Simulator**[^1]**

**INTRODUCTION**

If you’ve taken an operations management course in the last 4020 years, you are no doubt familiar with the Beer Game. This role-playing simulation of a simple production and distribution system has been used in countless undergraduate, graduate, and executive education courses since its creation at MIT in the 1960s.

The **LLM-powered Beer Distribution Game** shares much with the classic version \--- but with a twist:  instead of human players, this game is played among Large Language Models (LLMs) as autonomous decision makers. Each LLM (currently powered by **GPT-4o-mini**) controls one component of the supply chain \--- **retailer, wholesaler, distributor, or factory**. Identical to the setup of the traditional Beer Game, each role manages the inventory at that facility, responds to downstream orders, and decides how many units to order upstream (or produce, in the case of the factory) to minimize costs.

This is the **first online simulator** to experiment with LLM deployment in supply chain management. It offers features that enable you to explore a variety of simple and advanced supply chain management concepts. Most importantly, you will witness with immediate feedback the outcome of LLMs’ decision-making across a variety of supply chain scenarios you control.

*Since you are here, you have everything you need to operate the game. No additional setup is required.*

**THE SCENARIOS**

The Beer Game (LLM-powered and traditional) models the following scenarios. First, consider a simplified beer supply chain, consisting of a single retailer, a single wholesaler that supplies this retailer, a single distributor that supplies the wholesaler, and a single factory with unlimited raw materials that brews the beer and supplies the distributor. Each component in the supply chain has unlimited storage capacity, and there is a fixed supply lead time and order delay time between each component.

Every week, each component in the supply chain tries to meet the demand of the downstream component. Any orders that cannot be met are recorded as back orders and met as soon as possible. No orders will be ignored, and all orders must eventually be met. At each week, each component in the supply chain is charged a $1.00 shortage cost per back-ordered item. Also, at each week, each component owns the inventory at that facility. In addition, the wholesaler owns inventory in transit to the retailer, the distributor owns inventory in transit to the wholesaler, and the factory owns both items being manufactured and items in transit to the distributor. Each location is charged a $0.50 inventory holding cost per inventory item that it owns. Also, each supply chain member orders some amount from its upstream supplier. An order placed at the end of one week arrives at the supplier at the start of the next week. Once the order arrives, the supplier attempts to fill it with available inventory. Thus, an order placed at the end of week *w* arrives at the supplier at the start of week *w+*1\. The material is shipped (if it is in stock) at the start of week *w* \+1 and arrives at the supply chain member who placed the order no earlier than the start of week *w+*3\. This implies that the actual order lead time is two weeks. Each supply chain member has no knowledge of the external demand (except, of course, the retailer) or the orders and inventory of the other members. The goal of the retailer, wholesaler, distributor, and factory is to minimize total cost, either individually or for the system.

The LLM-Powered Beer Game has other options that model various situations. These differing options enable you to illustrate and compare concepts such as **lead-time reduction and global information sharing**. 

Information Sharing-Scenario 1: Consider a scenario exactly as described above, except that each supply chain member has full knowledge of the external demand of the customer. 

Information Sharing-Scenario 2: In addition to sharing customer demand information, the game allows sharing customer demand volatility over the last 6 (?) weeks  to all supply chain members to aid with memory and decision-making. 

Information Sharing-Scenario 3: The game also allows each player to use a demand forecasting model to assist with decision making. (Carol: question: how does the demand forecast work with and without info sharing)

Lead Time Impact: To illustrate the effect of lead time, order lead times can be reduced form the two weeks described above to only one week. Finally, additional production lead time can be incurred to the factory for realistic simulation.

**HOW THE GAME WORKS**

    	STEP 1: Set your simulation parameters that determines the supply chain scenario

    	STEP 2: Click "Run Simulation" to start \--- LLMs play the game in the background

    	STEP 3: Visualize the outcome of the game, the bullwhip effect and its associated metrics

**AUTHORS & CITATION**

This game is developed by [Carol Long](https://carol-long.github.io/), [David Simchi-Levi](https://slevi1.mit.edu/), [Andre du Pin Calmon](https://andrecalmon.com/), and [Flavio du Pin Calmon](https://people.seas.harvard.edu/~flavio/). Special thanks to Andre du Pin Calmon for providing helpful feedback. For inquiries or collaboration, feel free to reach out via email.

## Improvement Suggestions 

Please list down your suggestions for the simulation or the style of the website  
—---------------------------------------------------------------------------------------------------------------------------

1. Declutter parameter:  
   1. combine order lead time and shipping lead time into one  
   2. fix holding cost, back order cost, initial inventory  
2. 

[^1]: The description below is based on the Computerized Beer Game described in Designing and Managing the Supply Chain: Concepts, Strategies and Case Studies, McGraw-Hill, IL, Third Edition, July 2007, D. Simchi-Levi, P. Kaminsky and E. Simchi-Levi.