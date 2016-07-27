
## Stay out of the developers way

choo-cli itself should remain lightweight and avoid obfuscation, needless abstractions/indirection.

## Provide clear bound context

Remain loosely coupled, have only a few places to interact with our API, most of the logic should be in the template.

Whenever a user is touching choo-cli with their template, their template is the first-class citizen and the cli itself is there to help or get out of the way entirely.

## Reduce cognitive friction

Instead of users having to import somerthing like choo-cli-tools they can just create exports that match the commands passed to choo-cli directly.  This is the current plan as long as the cognitive friction remains low.
