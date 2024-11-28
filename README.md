## itkunclair

Welcome to **itkunClair** !

This project provides an efficient setup to get your application up and running with two different approaches:

1. **Using Docker**: The simplest way to get started with just a single command.
2. **Without Docker**: A manual setup in three steps, for those who prefer not to use Docker.

<hr />

### Getting Started

#### Prerequisites

- Ensure you have [Node.js](https://nodejs.org/en) installed.
- If using Docker, ensure [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/install/) are installed.

### Quick Start with Docker 🐳

Docker will automatically pull the necessary images, set up the MongoDB instance, seed data, and start the application.

Run the command:

```bash
npm run docker-compose
```

### Manual Setup (Without Docker) ⚙️

1. Copy the `.env.template` and change name as `.env`, then replace the MONGODB_URI with your personal mongodb url.

```dotenv
MONGODB_URI="mongodb://127.0.0.1:27017/itkunclair"
```

2. Seed the database:

```bash
    npm run seed
    # or you can override the existing table in same database
    npm run seed -- --override
```

3. start the application, then

```bash
npm run start
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## Todo List

- [x] &nbsp;Integrate local mongodb to docker. </br>
- [x] &nbsp;Add husky for linting before commit change. </br>
- [ ] &nbsp;Change useLocate to i18n.</br>
- [ ] &nbsp;Add 'skip' button for skipping current word </br>
- [ ] &nbsp;Data persistence</br>
- [ ] &nbsp;Feature add 'Transition with listen' </br>
- [ ] &nbsp;Feature add 'Listen word and example even turning off the screen' </br>
- [x] &nbsp;Add Pronunciation ability </br>
- [ ] &nbsp;Each word shown in the screen should be clickable for checking the meaning</br>
- [ ] &nbsp;Integrate AI to come up with the training suggestion</br>
