[< Back](software-requirements.md)

### UC2 - Change Turn

**Primary actor**: User  
**Affiliated actors**: The user initiates the use case by clicking on the *"End turn"* button.  
**Assumptions**: The user wishes to end the current turn. The user has probably altered some of the city's stats or has created unique events.

#### Basic flow

##### A) The user ends the current turn

1. The *user* clicks on the *"End turn"* button.
2. The *user* confirms his previous action at the popup that appears.

##### Alternative flow

2b. The *user* cancels his previous action.

1. The use case ends.

##### B) The new balance sheet is generated

1. Create new balance sheet.
2. Calculate income from fixed sources(taxes, trade & tributes).
3. Calculate the cost for fixed expenses(army and navy upkeep cost, garrison and )
4. Iterate the unique events and include their income/expenses in the new balance sheet.
5. Archive the previous balance sheet.
6. Change the turn.

#### Activity diagram

![Activity diagram](../diagrams/uc2-activity-diagram.png)