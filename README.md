# Task Manager

Example application for EggHead course.

The course is about full stack development with Angular and Firebase.

## Tentative Lesson List

The course is subdivided in 3 modules: **Cloud Firestore**, **Firebase Authentication**, and **Cloud Storage**.

Lessons:

- Course Intro explaining what we'll go through and the example application.
- How we build the app, the options you have, and initializing Firebase with the `ng add @angular/fire` schematic.
- A view of the Firebase Console anf the Firebase Services available for us.

### Cloud Firestore

- With example data show how we structure that data in Firestore, what collections and documents are.
- Fetch a list of items and display it on your application.
- Add a new item to the database.
- Fetch a specific item from the database and display it in the application.
- Update an item from the database.
- Delete an item from the database
  - Good Practice: Destructive database operations should have a confirmation step.

### Firebase Authentication

- Quick explain over the authentication page design.
- Add login feature.
- Add signup feature.
- Add password reset feature.
  - Don't let attackers find users here!
- Go back to the database and add the user ID to the tasks.
- Security Rules: Only authenticated users can see the data.
- Security Rules: Only the user that created the task can view/edit that task.
- Security Rules are not filters!
- Firestore query data for the specific user.
- Security Rules refactor, add functions to avoid repeating yourself.

### Cloud Storage

- Upload files to Cloud Storage
  - Avoid repeated names!
- Get the download URL for your file and add it to the task.
- Storage Security Rules: Only authenticated users can upload/view files.
- Storage Security Rules: Only allow specific types of files.
- Storage Security Rules: Only allow files below a certain size.

### Cloud Functions

- Short intro to Firebase Cloud Functions, what they are and what they're used for.
- Firestore Triggers: Listening to new documents and updating them.

### Cloud Functions Extensions

- Explain what they are and the benefit.
- Show an example with the delete user data extension: https://extensions.dev/extensions/firebase/delete-user-data
