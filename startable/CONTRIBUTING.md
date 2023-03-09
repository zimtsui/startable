```mermaid
classDiagram
	direction BT
	StartableLike <|-- StateXInstance
	State o-- AgentLike
	Agent --|> AgentLike
	AgentLike --|> StartableLike
	Startable *-- Agent
	State --|> StartableLike
	Startable --|> StartableLike
	Startable *-- State
	Startable --> StateXConstructor
	StateXConstructor --> StateXInstance
```
