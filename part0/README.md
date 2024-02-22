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

## Exercise 0.5 - Single-Page App Diagram

This diagram depicts what happens when a user navigates to the
single-page app version of the notes app at
[https://studies.cs.helsinki.fi/exampleapp/spa](https://studies.cs.helsinki.fi/exampleapp/spa)

```mermaid
sequenceDiagram
    participant browser as Browser
    participant server as Server

    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    server-->>-browser: 200 OK - response body: HTML document
    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    server-->>-browser: CSS file
    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    server-->>-browser: JavaScript file (specifically for the SPA-version of the web app)

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    server-->>-browser: [{ "content": "Hello, World!", "date": "2024-02-22" }, ... ]

    Note right of browser: The browser executes the callback function that renders the notes
```

Note that the initial GET request is the same as with the
traditional-style web app. The real difference between the two web app
approaches will be seen in the next exercise, where the JavaScript
will directly manipulate the DOM rather than refresh the whole page
with a new GET request.

## Exercise 0.6 - New Note in Single-Page App

This diagram depicts what happens when a user writes content in the
text field and clicks the `save` button on the SPA-version of the
notes app found at
[https://studies.cs.helsinki.fi/exampleapp/spa](https://studies.cs.helsinki.fi/exampleapp/spa)

```mermaid
sequenceDiagram
    actor user as User
    participant browser as Browser
    participant server as Server

    user->>browser: Types "Hello, World!" in text input
    user->>browser: Clicks *save* button

    Note right of browser: The browser adds the user's note to the notes-list in local memory,<br />and clears the text field to show that the note was committed.
    Note right of browser: The browser re-draws all the notes on the page via the DOM API.<br />The user can now see the new note.

    browser->>+server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa<br />Request body: { "content": "Hello, World!", "date": "2024-02-22" }
    server-->>-browser: 201 Created<br />Response body: { "message": "note created" }

    Note right of browser: Note that the browser does nothing with the response in this specific example,<br />but could easily implement some code to deal with errors
```

As you can see, the SPA app architecture is more efficient on
bandwidth than the traditional app architecture. Instead of
re-requesting all the data for a page, the SPA is simply updating
portions of the page that need to be updated.

An important note to point-out is that this implementation of a
Single-Page App does not follow RESTful API practices. Don't make an
SPA like this. There are better, cleaner, and more accepted ways of
implementing endpoints.
