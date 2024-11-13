This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, copy the `.env.local.template` as name with `.env.local`, and change MONGODB_URI to your personal mongodb url.

Second, seed the data into your mongodb by running below command:

```bash
    npm run seed
    # or you can override the same table
    npm run seed -- --override
```

Finally, you are abled to run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Todo List

- [x] &nbsp;Integrate local mongodb to docker. </br>
- [x] &nbsp;Replace loading component with pretty loader </br>
- [ ] &nbsp;Add 'skip' button for skipping current word </br>
- [ ] &nbsp;Beautify 'Show Answer' part </br>
- [ ] &nbsp;Integrate AI to come up with the training suggestion</br>
- [ ] &nbsp;Add more word books, current CET4 and CET6 are no clear.</br>
