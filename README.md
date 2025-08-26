Navigating the Future of Memory.

The code in this repository is the back end work done by Hezekiah Owuor. Currently sending a prompt to the 
LLM framework is functional via the webpage but you can also create curl commands to test it with the following curl commands: 

curl -s -X POST http://localhost:3001/api/ai/embed \
-H "Content-Type: application/json" \
-d '{"text":"Co-cooking can increase motivation and skill."}'

curl -s -X POST http://localhost:3001/api/ai/say \
-H "Content-Type: application/json" \
-d '{"prompt":"In one short line, say hello from Gemini."}'

To run this program please run 

npm install

to install all the required node modules. Then run the folowing command to launch the server

npm run dev

MongoDB