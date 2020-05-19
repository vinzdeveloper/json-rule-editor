## json-rule-editor

### More examples in Decisions

We have seen simple rule structure example before which has just one top node *"all"*. However, Json rules engine offers many features which will be useful to manage business decisions effectively.

***Nested ‘all’ or ‘any’***

You can configure the decisions with nested all or any combination as mentioned below

We will use the same rule file Employee-Salary created before for this section. 

Previously, we have configured facts such as designation, type and experience to derive *salary* for couple of designations **Manager** and **Contractor** to get better understandings. However, in real time, we might have other designation roles and facts to consider. Lets see a example below to understand much better

For ex:

We get new requirement to add *"Architect"* role with the same salary as *"Manager"* role. To handle this scenario, we can do either of the below 

1. Create a new decision with same salary.

    ![create new decision](https://vinzdeveloper.github.io/json-rule-editor/docs/images/more-decisions1.png)

2. Or You can modify the existing decision by nesting with **any** condition as below 

    ![create another decision](https://vinzdeveloper.github.io/json-rule-editor/docs/images/more-decisions2.png)


First solution is same as we discussed before. Please refer [previous section](https://vinzdeveloper.github.io/json-rule-editor/docs/create-rules.html) incase any queries,

Lets explore the second solution to understand how nested conditions can be created.

*Step 1: Add new decision with two facts experience and type*

![create nested decision](https://vinzdeveloper.github.io/json-rule-editor/docs/images/more-decisions3.png)

*Step 2: Select "Add Any" menu in **"Step 2: Add / Remove facts"** - you will get something as below*

![create nested decision](https://vinzdeveloper.github.io/json-rule-editor/docs/images/more-decisions4.png)

*Step 3:  Click "any" node as highlighted below to add facts under this node*

![create nested decision](https://vinzdeveloper.github.io/json-rule-editor/docs/images/more-decisions5.png)

*Step 4: Select "Add Facts" menu in **"Step 2: Add / Remove facts"** and click Add button*

![create nested decision](https://vinzdeveloper.github.io/json-rule-editor/docs/images/more-decisions6.png)

**After added:**

![create nested decision](https://vinzdeveloper.github.io/json-rule-editor/docs/images/more-decisions7.png)

*Step 5: Select "Add Facts" menu in **"Step 2: Add / Remove facts"** and click Add button to add another role "Architect"*

![create nested decision](https://vinzdeveloper.github.io/json-rule-editor/docs/images/more-decisions8.png)

*Step 6: Select "Add outcome" menu in **"Step 3: Add outcome"** and give value*

*Step 7: Click Add rulecase button*

That's it!!!

Likewise, you can add any number of nested nodes under single conditions. Both solution 1 and solution 2 are doing the same thing, depends on business requirement and number of facts, decide the pattern whichver it suits better.

[Next section - Advanced examples](https://vinzdeveloper.github.io/json-rule-editor/docs/advanced.html)

[Go back to previous page](https://vinzdeveloper.github.io/json-rule-editor/docs/manage-rules.html)

[Go Home](https://vinzdeveloper.github.io/json-rule-editor/docs/)



