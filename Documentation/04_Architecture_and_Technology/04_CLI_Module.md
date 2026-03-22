# 04 – CLI Module (score-cli)

## 1. Purpose

The CLI module provides a command-line interface for interacting with the SCORE system.

It is a **presentation adapter** that translates terminal commands into calls to core use cases.

The CLI does NOT contain business logic.

---

## 2. Architectural Role

Within the Clean Architecture model:

```text
CLI
↓
Application Use Cases 
↓
Domain
```

The CLI:
- Parses user input
- Validates parameters
- Calls use cases
- Formats output

It must never:
- Implement scoring rules
- Modify domain logic
- Contain decision-making algorithms

---

## 3. Technology Stack

The CLI uses:

- Typer (command framework)
- Rich (optional enhanced formatting)
- Click (via Typer)

These dependencies exist ONLY in the CLI module.

Core must not depend on them.

---

## 4. Command Structure

Current command structure:

```text
score
│
└── recommend
└── run
```

Example usage:

```bash
score recommend run --context presentation
```

Alternative invocation:

```bash
python -m score_cli.main recommend run --context presentation
```

---

## 5. Command Mapping to Use Cases

| CLI Command   | Core Use Case       |
|---------------|---------------------|
| recommend run | recommend_outfits() |

The CLI simply gathers input and forwards it to the core.

Example flow:

1. User executes command
2. CLI parses options
3. CLI constructs domain objects
4. CLI calls core use case
5. CLI prints the formatted result

---

## 6. CLI Entry Point

Defined in:

```text
packages/cli/pyproject.toml
```

Example:

```toml
[project.scripts]
score = "score_cli.main:app"
```

This creates the executable:

`score`

Installed inside the active environment:

```bash
<env>/Scripts/score.exe  (Windows)
```

---

## 7. Responsibility Boundaries

CLI MAY:
- Format output
- Use colors
- Use tables
- Handle argument validation
- Provide help messages

CLI MUST NOT:
- Perform scoring
- Perform rule evaluation
- Access databases directly
- Persist preferences
- Load ML models

---

## 8. Example Internal Structure

```text
packages/cli/src/score_cli/
│
├── main.py
├── commands/
│   ├── recommend.py
│   └── preferences.py
├── formatters/
│   └── console_formatter.py
└── __init__.py
```

This structure keeps commands modular.

---

## 9. Error Handling Strategy

CLI is responsible for:
- Catching application-level exceptions
- Converting them into readable terminal messages
- Exiting with proper status codes

Core should raise structured exceptions.
CLI translates them into user-friendly output.

---

## 10. Extensibility

Future CLI commands may include:
- score wardrobe add
- score preferences set
- score evaluate image
- score train

Each command must map to a dedicated use case.

---

## 11. Testing Strategy

CLI should have its own tests:

```text
packages/cli/tests/
```

Tests should verify:
- Command parsing
- Proper mapping to use cases
- Exit codes
- Help output

CLI tests may mock the core.

Core tests must not depend on CLI.

---

## 12. Why CLI Is Separate

Benefits of separation:
- Replace CLI with REST API later
- Replace CLI with GUI only deployment
- Automated testing without UI noise
- Clear separation of concerns

This is a deliberate architectural decision.

---

## 13. Summary

The CLI module:
- Is an adapter
- Translates user input to use cases
- Formats output
- Contains zero business logic

It is replaceable.

The core is not.