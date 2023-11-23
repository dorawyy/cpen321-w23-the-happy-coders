// ChatGPT Usage: Partial
class OpenAI {
    constructor(str){
        this.apiKey = str
    }

    chat = {
        completions: {
            create: async (params) => {
                if (params.messages.some((msg) => msg.content.includes("error"))) {
                    throw new Error("Mocked error response");
                  }
          
                  const mockResponse = {
                      choices: [
                        {
                          message: {
                            content: "Mocked completion content",
                          },
                        },
                      ],
                    
                  };
          
                  return mockResponse;
            }
        }
    }
  }
  
  module.exports = OpenAI;
  