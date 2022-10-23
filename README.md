# Easy Classrooms

An easy-to-use solution to share assignments with students, even those who don't want to register to follow along class.


## Table of Contents

* [Links](#links)
* [Screenshots](#screenshots)
  + [Landing page](#landing-page)
  + [Home page (teacher view)](#home-page--teacher-view-)
  + [Home page (student view)](#home-page--student-view-)
  + [Classroom management (dark mode)](#classroom-management--dark-mode-)
  + [Lesson (enrolled student view)](#lesson--enrolled-student-view-)
* [Tech Stack](#tech-stack)
* [Features](#features)
* [Run Locally](#run-locally)
* [Environment Variables](#environment-variables)
* [Lessons Learned](#lessons-learned)
* [Roadmap](#roadmap)
* [Author](#author)
## Links

- [Hosted project](https://easy-classrooms.raissak.com/)

## Screenshots

### Landing page
![screenshot of the landing page](https://i.imgur.com/mb4s7kGl.png)

### Home page (teacher view)
![screenshot of the home page](https://i.imgur.com/mCUiLwJl.png)

### Home page (student view)
![screenshot of the home page](https://i.imgur.com/351B58Il.png)

### Classroom management (dark mode)
![screenshot of classroom management page](https://i.imgur.com/Wv8kg0Bl.png)

### Lesson (enrolled student view)
![screenshot of lesson page as viewed by a student](https://i.imgur.com/45AepZvl.png)
## Tech Stack

**Client:** JavaScript, HTML, EJS, TailwindCSS

**Server:** Node, Express, MongoDB/Mongoose

## Features

  - Secure login with Passport Auth'
  - Cache for external API calls to Unsplash
  - Uploads pictures to Cloudinary or retrieves a random one if Classroom creation form is left empty
  - Light and dark mode toggle
  - Prompts and mobile menu are contained in accessible modals
  - Responsive for desktop & mobile
  - Users may access a classroom using its specific classroom password
  - Users don't need to log in to access a classroom or lessons, but their usage is limited
  - Students who are logged in and enrolled into a classroom can leave comments in lessons and track lesson completion
## Run Locally

Clone the project

```bash
  git clone https://github.com/raissa-k/talkincorporate.git
```
Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Environment Variables

To run this project, add the following environment variables to your `.env` file in `/config/.env`

A `.env.example` file is supplied inside the `config` folder.

```bash
DB_STRING= (MongoDB)
PORT= (any of your choosing)
CLOUD_NAME= (from Cloudinary Programmable Media)
API_KEY= (from Cloudinary Programmable Media)
API_SECRET= (from Cloudinary Programmable Media)
UNSPLASH_CLIENT_ID= (from Unsplash Image API)
```

## Lessons Learned

- In this project, it turned out to be simpler to create an Enrollment model schema rather than integrate students, classrooms and lessons directly. Less turned out to be more.
- Rendering a classroom using EJS while taking into account the enrollment status and user authentication was a fun challenge which would have been made much easier with front end libraries such as React.
- When it comes to text, CSS `text-transform: uppercase` also directly affects the element, and so adding aria-labels to buttons might seem like extra work but cannot be skipped.
- While I did choose a pre-made color theme which looked fine at first, it turned out to not generate the sufficient contrast in some elements so I had to add further customization.
## Roadmap

- [ ]  Add different authentication methods
- [ ]  Enable password change and recovery
- [ ]  Add lesson editing
- [ ]  Replies to comments inside a lesson
- [ ]  Integration with calendar
- [ ]  Add button to share classroom directly
- [x]  Comments on lessons
- [x]  Lessons can be marked complete
- [x]  Add classroom password protection
- [x]  Users may view classroom and lesson without logging in
## Author

**Raissa K.**

- [Github](https://www.github.com/raissa-k)
- [Website](https://raissak.com)

