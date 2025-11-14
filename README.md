# SBA 5. This is a blog posting site. You can set a title of your post and post your thoughts for all to see. You can edit your posts or delete your posts. Posts persist after page reload or when you open your page later.

A reflection on your development process, challenges faced, and how you overcame them.
Any known issues or features not implemented.

* This SBA was a pretty good culmination of everything we learned so far for advanced DOM manipulation. Understanding event propagation, I used it for event delegation to handle different buttons and what they do, instead of the performance-eating adding event listeners to every element that needs it. Client-side validation was straightforward as I just check if the post's forms were empty or not. There was a small challenge I had to come to terms with and that was figuring out the marriage between a list of JavaScript objects and how these objects can be manipulated from the DOM... I found a neat solution: I give each object an id, and I need to save this id somewhere in the created node into the DOM. What I did is I attached this id to the created element's id attribute, that way I can reference the event target id's attribute and match it with the object's id property! 

* No known issues, I could have added the timestamp optional requirement but I got a little lazy. I have an idea on how to add it given a bit more time.