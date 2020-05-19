## json-rule-editor

### Why Rule Engine?

It’s obvious that coupling your business rules along with your application code is cumbersome, tedious to maintain and often end up with multiple nested if and switch case conditions. Separating the business logic from your application code would give many benefits such as 

-  Clean code and Readable
-  Pluggable rules and can use it across application; reusability
-  And, Easy to maintain

> Please go through the concepts of rule engine and understand when and which cases it actually required in your application if you are not familiar with. 

### json-rules-engine

[json rules engine](https://github.com/CacheControl/json-rules-engine) is the effective rule engine can be easily hooked into any server based or web based application just like other javascript libraries, besides you can maintain the application business rules in json files.

### What is Json Rule Engine and Json rule editor?

It is really important to understand the basic and fundamental differences between json rule editor and json rules engine.

- **json rule editor** is a web based tool to create / manage  / view the business rules. Primarily to generate business rules into json file. It **doesn’t need** to be added into your application code.

- And, **json rules engine** should be imported into your application and eventually you should pass the json file (generated from json rule editor app) along with input parameters to determine the outcomes.

It is fairly straight forward process to incorporate the json rules in your application. Its completely fine if you are bit struggling to catch up how it’s actually works in real world. It would make more sense if you go through the further sections - explained in detail.


Lets see how to create json rule file using this tool in next section

[Next section - Create decisions using rule editor](https://vinzdeveloper.github.io/json-rule-editor/docs/create-rules.html)

[Go back to previous page](https://vinzdeveloper.github.io/json-rule-editor/docs/)


