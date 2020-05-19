## json-rule-editor

### Advanced concepts of json-rules-engine

json rules engine provides other feature to load the input fact value aynchronously from remote system via api.
Go through the advance concepts explained in detail [here](https://github.com/CacheControl/json-rules-engine) to understand better.

We will take the same example *"Employee-Salary"* to handle path parameter. Lets assume, `designation`, `experience` and `type` fact values are coming via api.

Step by Step process explained below to add path parameter along with facts in decisions

***Step1: Add object reference***

1. Go to Facts tab
2. Click **Add icon** at right corner of tool bar.
3. Specify the fact object name and select **object** as type
4. Click **Add facts** button

    ![create path fact](https://vinzdeveloper.github.io/json-rule-editor/docs/images/path-fact.png)

***Step2: Add path parameter reference***

1. Go to Decisions tab
2. Click **Add icon** at right corner of tool bar.
3. Select all / any in **"Step 1: Add Toplevel"**
4. Select Add facts menu in **"Step 2: Add / Remove facts"**
5. Select **Add path** icon at top right corner of panel.
6. Give fact object name, operator, value along with path parameter as below

    ![create path decision](https://vinzdeveloper.github.io/json-rule-editor/docs/images/path-decisions1.png)

7. Add other facts with path parameter

    ![create path decision](https://vinzdeveloper.github.io/json-rule-editor/docs/images/path-decisions2.png)

8. Click **Add Rulecase** button

***Caution***

> You can’t validate such path parameter decisions in our rule editor though, because these values are coming from real time api,
> so its not possible to retrieve and validate such decisions in this tool.

### Add more parameters in output

Sometimes, it would make sense to add more values along with output value. In order to add extra values, you can click ***‘Add Params’*** icon in output panel. You can add any number of key value pairs along with the output type. 

![create path decision](https://vinzdeveloper.github.io/json-rule-editor/docs/images/output-params.png)


### Examples

Couple of sample examples are available [here](https://github.com/vinzdeveloper/json-rule-editor) under **examples** folder. Play with these files by importing it into rule editor.

Feel free to raise issues or concerns in [github](https://github.com/vinzdeveloper/json-rule-editor/issues) or contact here <vinzdeveloper@gmail.com>. Happy to look into your concerns!!

[Go back to previous page](https://vinzdeveloper.github.io/json-rule-editor/docs/decisions.html)

[Go Home](https://vinzdeveloper.github.io/json-rule-editor/docs)