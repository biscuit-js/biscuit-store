## Contributing
Any contribution you make will make the biscuit-store better. Please follow the rules listed below.

### Reporting Issues and Asking Questions
Before you ask a question, try to find a solution on the [issue tracker](https://github.com/Biscuit-javascript/biscuit-store/issues) page and on the Internet.

If you do not find a solution, then open the problem. Pay special attention to the details, make a clear and constructive description, attach logs if any.

**Use templates:**
[bug_report template](https://github.com/biscuit-js/biscuit-store/blob/master/.github/ISSUE_TEMPLATE/bug_report.md)
[feature request template](https://github.com/biscuit-js/biscuit-store/blob/master/.github/ISSUE_TEMPLATE/feature_request.md)

### Be friendly
Do not be rude, do not troll or humiliate members of the community, stay professional and be constructive.

### Development
Before you start writing code and making a pull-request, review the [issue tracker](https://github.com/Biscuit-javascript/biscuit-store/issues), perhaps your solution has already been implemented. It is also a good practice to first suggest an idea and then start writing code.

To start development, you will need to clone the store:
```
git clone https://github.com/Biscuit-javascript/biscuit-store.git
```
When writing code, do not forget to conduct testing and linting:

run testing:
```
yarn run test
```
run linting:
```
yarn run lint
```
Follow the rules for writing code, do not set exceptions, and do not change the lint configuration.

### Sending a Pull Request
Before sending, be sure to make sure that the tests worked out positively.

Organization of the development process:
- Fork the repository.
- Make a branch from the ```master``` branch (Follow the rules for naming branches)
- Make your changes
- Perform testing
- Send pull-request to ```develop``` branch

Please state the description more clearly. This will avoid misunderstandings and rejection of PR.

### Rules for creating branches
If you want to fix a bug:
```
bugfix/<version>/<bug number>
```

Features:
```
feature/<brief description>
```

Documentation edits:
```
docs/<filename>
```

**Thank you for your cooperation!**
