
</div>

 ## About The Project

![ ](https://socialify.git.ci/Skullians/ParkerJS/image?description=1&descriptionEditable=The%20Node.JS%20version%20of%20Parkertron.%20But%20Jankier.&font=KoHo&forks=1&issues=1&language=1&name=1&owner=1&pattern=Plus&stargazers=1&theme=Dark)

<a href="https://github.com/Skullians/ParkerJS/issues/new?labels=bug&template=bug-report---.md">Report Bug .</a>
<a href="https://github.com/Skullians/ParkerJS/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>

Meet **ParkerJS**.
ParkerJS is an attempt to replicate the functionality and features of [Parkertron](https://github.com/parkervcp/parkertron), by [parkervcp](https://github.com/parkervcp) in JS (runtime Node.JS).
 ### Built With

ParkerJS is built with:

- [NodeJS](https://nodejs.org/)
- [Discord.JS](https://discord.js.org/)
 ## Getting Started

Want to run this bot for yourself?
Follow the steps below.
 ### Prerequisites

You will require Node.JS, NPM and a Discord Bot.
Download NodeJS here for your respective platforms. - https://nodejs.org/en/download. This project was built with Node.JS v20.10.0.

Install the latest NPM via the command:
`npm install -g npm`.

Head to https://discord.com/developers/applications and create a **New Application**.
Customise it's name, whatever you want.
Ensure 'Public Bot' is disabled, and has at least the **Server Members** and **Message Content** intent enabled.

Congrats! Continue to the Installation section.


 ### Installation

Clone the repo, either via the command `git clone https://github.com/Skullians/ParkerJS/releases/latest` or downloading the source code ZIP file from https://github.com/Skullians/ParkerJS/releases/latest.

1. Once downloaded, unzip the file (if necessary) and open the project.

2. Head to `src/Configuration/Discord-Configuration/config.yml` and enter your Discord Bot's token, discord server ID (1 maximum) and channel IDs to listen to.
**This bot only supports a single discord server.** Feel free to change any other settings :)

3. Head to `src/Configuration/Support-Configuration/messages.yml` and configure your support messages there :) You can have unlimited support configs / regexes, although the more you add the longer it will take (probably not noticeable).

4. Configuration is all done! Head to the Usage section.
 ## Usage

To run the bot, open your respective OS's Command Prompt.
Head to the root directory of the ParkerJS folder, and run
`node .`
The bot should start up with no problems.
 ## Roadmap

- [x] Text Parsing
- [x] Image Parsing (directly attached + URLs)
- [x] Attachment Parsing (text files)
- [x] Regex Support
- [x] Application Commands (WIP)
   - [x] Config reload command
   - [x] Blacklist User command
   - [ ] something else?

See the [open issues](https://github.com/Skullians/ParkerJS/issues) for a full list of proposed features (and known issues).

 ## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
 ## License

Distributed under the Apache-2.0 License. See [Apache-2.0 License](https://www.apache.org/licenses/LICENSE-2.0.txt) for more information.
 ## Acknowledgments

I cannot stress enough:
**Thankyou [parkervcp}(https://github.com/parkervcp) for allowing me to do this. Please give them a follow, and make sure to star the original [parkertron](https://github.com/parkervcp/parkertron) project itself.**
<3

This is to acknowledge the other amazing NPM packages used in this project:


- [Axios](https://github.com/axios/axios)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- [colors.js](https://github.com/Marak/colors.js)
- [js-yaml](ca/js-yaml)
- [tesseract.js](https://github.com/naptha/tesseract.js)

 ## FAQ

This is the FAQ, where I (hopefully) answer questions that people might have.
No-one will probably use this project nor read it, but why not? Here goes.

1. **Why?** - Why did I do this? Why the hell not? Hopefully I can include some features that parkertron (~~currently~~) does not have, such as Slack support. I mainly did it for fun. It's a nice little project.
2. **Custom Commands** - One feature of Parkertron is the support for custom chat commands. For Discord at least, I am not currently planning on adding commands for this. If you want custom commands, use a different bot, such as carl bot, or make your own bot. For Slack and/or IRC, I will be including this functionality.

