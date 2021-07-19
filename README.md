# 💖 React-social-network
The website includes basic functions of a social network: chat, post, comment, announcement, ... Inspired by create-social-network project.
- Link github: https://github.com/DimiMikadze/create-social-network
# 👉 Usage
- cd frontend -> npm i -> add .env -> npm start
- cd backend  -> npm i -> add .env -> npm start

# 👉 Technique Use:
- GraphQl - Apollo
- Express
- React (styled-component, ContextProvider, apollo/client)

# 👉 New features:
-  UI
    - Add color, add Svg, icons
    - Component postCard 
    - Component notification item -> add time, ...
    - fake event (fake link, fake post, fake upload, fake comment)
    - add Load modal all component
    - Transition (dropdown)

-  Restructure project

-  fix bug upload file node v14: 
    - uninstall apollo-server (instead of install apollo-server-express and graphql-subscriptions)
    - Add scalar to schema and upload to resolvers
    - uploads: false in createApolloServer
        
-   Public url: share link
-   Load modal, Edit post
-   Video post
-   Theme, Add emoticon, icon
 
