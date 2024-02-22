# Part 0 - Exercises 0.4-0.6

After reading the articles from exercises 0.1-0.3, here are the
requested diagrams for exercises 0.4-0.6.

## Exercise 0.4 - New Note in Traditional Web App

This diagram depicts what happens when a user writes content in the
text field and clicks the `save` button on the page
[https://studies.cs.helsinki.fi/exampleapp/notes](https://studies.cs.helsinki.fi/exampleapp/notes)

```mermaid
sequenceDiagram
    actor user as User
    participant browser as Browser
    participant server as Server

    Note right of browser: Page has already been retrieved via GET request at<br />https://studies.cs.helsinki.fi/exampleapp/notes

    user->>browser: Types "Hello, World!" in text input
    user->>browser: Clicks *save* button

    browser->>+server: POST https://studies.cs.helsinki.fi/exampleapp/new_note<br />Request body (JSON-equivalent): { "note": "Hello, World!" }
    Note left of server: The server adds the user's note to the list<br />(In memory - It's not stored in a database)
    server-->>-browser: 302 Found - Location: /exampleapp/notes

    Note right of browser: The browser gets a URL redirect, which causes a GET request as done previously:

    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    server-->>-browser: HTML document
    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    server-->>-browser: CSS file
    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    server-->>-browser: JavaScript file

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    server-->>-browser: [{ "content": "Hello, World!", "date": "2024-02-22" }, ... ]

    Note right of browser: The browser executes the callback function that renders the notes
    Note right of browser: The browser now shows all notes on the server,<br />which consequently has the user's added note<br />and any additional notes since the last GET request or refresh
```
