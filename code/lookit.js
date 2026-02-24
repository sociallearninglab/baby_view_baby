function generateProtocol(child, pastSessions) {
  return {
      frames: {
          'email-survey': {
            'kind': 'exp-lookit-survey',
            'formSchema': {
                'schema': {
                    'type': 'object',
                    'title': 'Please enter your email address below. This will be used for sending you the $5 gift card.',
                    'properties': {
                        'Email': {
                            'type': 'string',
                            'title': 'Email',
                            'required': true
                        }
                    }
                }
            },
            'nextButtonText': 'Continue'
        },
          'welcome': {
              'kind': 'exp-lookit-text',
              'blocks': [{
                  'title': 'Welcome!',
                  'text': "<b>NOTE:</b> To avoid technical issues, please <b>use Safari or Chrome</b> when participating in this study!\n\n When you're ready, press 'next' to get started!"
              }],
              'showPreviousButton': false,
              'nextButtonText': "Click here to start!"
          },
          'video-config': {
              'kind': 'exp-video-config',
              'introText': "First, we'll make sure that you and your child are all set up."
          },

          'start-recording': {
              'kind': 'exp-lookit-start-recording',
              'imageAnimation': 'spin',
              'displayFullscreen': true
          },


          'video-consent': {
              "gdpr": false,
              'kind': 'exp-lookit-video-consent',
              'template': 'consent_005',
              'PIName': 'Hyowon Gweon',
              'institution': 'Stanford University',
              'PIContact': 'Hyowon Gweon (sll_lookit@stanford.edu)',
              'purpose': 'One of the first things an infant encounters is themselves, but we know only little about the nature and origins of the "self" and how it may change while growing up. In this study, we aim to broadly explore how infants at the very beginning of their development react and behave when seeing themselves on a screen, and how their responses compare to seeing other babies who aren’t them.',
              'risk_statement': 'There are no expected risks if you participate in the study.',
              'voluntary_participation': 'Participation in this study is entirely optional, and you are free to exit at any time.',
              'payment': 'There are no costs to participating. There are also no known risks associated with this study beyond those of everyday life. Although this study will not benefit your child directly, it will add to our understanding of how children think in general. You will get compensated if you meet the stated requirements.',
              'datause': 'The researchers and study staff follow federal and state laws to protect your privacy, so all of your information and research records will be kept confidential. The only exception to these procedures for maintaining confidentiality is that we are required by law to report to the appropriate authorities suspicion of harm to your child or to others. More information on how we keep your videos and data private can be found at lookit.mit.edu/faq.',
              'research_rights_statement': 'The Institutional Review Board (IRB) of Stanford University has approved this research study. If you have questions regarding your rights as a research subject you may contact the IRB office at 650-723-2480, or by mail at Research Compliance Office, Stanford University, 1705 El Camino Real, Palo Alto, CA 94306.'
          },
          
          "video-use-consent-survey": {
              "kind": "exp-lookit-survey",
              "showPreviousButton": true,
              "nextButtonText": "Next",
              "formSchema": {
                  "schema": {
                      "type": "object",
                      "title": "VIDEO USE ON CHILDRENHELPINGSCIENCE",
                      "properties": {
                          "videoUseConsent": {
                              "type": "string",
                              "title": "We would love to use your video today in a followup study, in which babies view other babies on the screen. You can decide whether you want your video to be used in this way or not. If you agree, before any use of your video, we will contact you and send you your full footage so you can review it first. Importantly, your video will NOT be released to the public or made available for download in any way; it will only be used for the purpose of this upcoming research study.",
                              "enum": ["yes", "no"],
                              "required": true
                          }
                      }
                  },
                  "options": {
                      "fields": {
                          "videoUseConsent": {
                              "type": "radio",
                              "optionLabels": ["Yes, you can use the videos in this way", "No, please do not use my videos for this"],
                              "message": "Please select one option to continue."
                          }
                      },
                      "hideInitValidationError": true
                  }
              }
          },

          "audio-check": {
              "kind": "exp-lookit-instructions",
              "blocks": [{
                      "title": "Instructions (Your child does not need to be with you yet)"
                  },
                  {
                      "title": "What's going to happen:",
                      "listblocks": [{
                              "text": "First, we'll make sure that you and your child are all set up."
                          },
                          {
                              "text": "Then, your child will see and be able to watch themselves on the computer screen. This phase will last 3 minutes."
                          },
                      ]
                  },
                  {
                      "text": "Please turn the volume up so it's easy to hear but still comfortable.",
                      "title": "First things first: checking your audio!",
                      "mediaBlock": {
                          "text": "You should hear 'Ready to go?'",
                          "isVideo": false,
                          "sources": [{
                                  "src": "https://s3.amazonaws.com/lookitcontents/exp-physics-final/audio/ready.mp3",
                                  "type": "audio/mp3"
                              },
                              {
                                  "src": "https://s3.amazonaws.com/lookitcontents/exp-physics-final/audio/ready.ogg",
                                  "type": "audio/ogg"
                              }
                          ],
                          "mustPlay": true,
                          "warningText": "Please try playing the sample audio."
                      },
                  },
              ],
              "nextButtonText": "More instructions!"
          },



          'instruction-video': {
              'kind': 'exp-lookit-instructions',
              'blocks': [{
                  "title": "Play the video below to see what will happen during the study.",
                  'mediaBlock': {
                      'isVideo': true,
                      'sources': [{
                          'src': 'https://raw.githubusercontent.com/sociallearninglab/baby_view_other_baby/main/mp4/instructions.mp4',
                          "type": "video/mp4"
                      }],
                      'autoplay': true,
                      'mustPlay': true,
                      "warningText": "Please finish watching the video."
                  }
              }],
              'showWebcam': false,
              'doRecording': true,
              'nextButtonText': 'Next'
          },

          "instructions-3": {
              "kind": "exp-lookit-instructions",
              "blocks": [{
                      "title": "All set up!"
                  },
                  {
                      "title": "To do one last check of your webcam setup, press the 'Check video!' button!"
                  }
              ],
              "nextButtonText": "Check video!"
          },


          "webcam-display-check": {
              "kind": "exp-lookit-webcam-display",
              "blocks": [{
                  "title": "Last check: Does the video look good?",
                  "blocks": [{
                      "text": "If so, you can go ahead and press the 'Click to continue' button. See you in about 5 minutes!"
                  }, ]

              }],
              "nextButtonText": "Click to continue!",
              "showPreviousButton": false,
              "startRecordingAutomatically": false
          },



          'mirror-trial': {
            'kind': 'exp-lookit-instructions',
            'blocks': [{
                'title': '',
                'text': `
                    <div style="width:100%; height:80vh;">
                        <iframe
                            src="https://sociallearninglab.github.io/baby_view_baby/lag-mirror-study.html?condition=lag&participant_id=${child.id || 'unknown'}"
                            allow="camera; microphone; autoplay"
                            style="width:100%; height:100%; border:none;"
                        ></iframe>
                    </div>
                `
            }],
            'nextButtonText': 'Continue to next section',
            'showPreviousButton': false,
            'doRecording': true,
        },


          'study-outro': {
              'kind': 'exp-lookit-text',
              'blocks': [{
                  'title': "We're all done! Awesome job!",
                  'text': "The last thing left to do is to fill out a short exit survey, where you'll be asked about to confirm some information and select your level of privacy. Once you submit that survey, there'll be a little debrief where we give more background information about the study and provide some links where you can find out more on your own."
              }],
              'showWebcam': false,
              'nextButtonText': 'Next'
          },



          'stop-recording': {
              'kind': 'exp-lookit-stop-recording',
              'imageAnimation': 'spin',
              'displayFullscreen': true,
              'showProgressBar': true,
              'waitForUploadMessage': 'Uploading video... Please wait.',
          },




          "mirror-questions": {
            "kind": "exp-lookit-survey",
            "showPreviousButton": true,
            "nextButtonText": "Next",
            "formSchema": {
              "schema": {
                "type": "object",
                "title": "Child Media and Mirror Experiences",
                "properties": {
                  "introText": {
                    "type": "string",
                    "title": "In this survey, we are interested in your child's prior experience seeing themselves on screens and in mirrors. In answering the questions below, we encourage you to give your responses as best you can recall (that is, your best estimate or guess)."
                  },
                  "mirrorFirstAge": {
                    "type": "string",
                    "title": "1-1. At which age did your child look in a mirror for the first time? Please provide your answer in MONTHS of age (if you're not sure, please provide your best guess).",
                    "required": false
                  },
                  "mirrorFrequency": {
                    "enum": [
                      "never",
                      "less-than-weekly",
                      "weekly",
                      "several-times-weekly",
                      "daily",
                      "several-times-daily"
                    ],
                    "type": "string",
                    "title": "1-2. In the last MONTH or so, how often did your child look in a mirror?",
                    "required": false,
                    "default": "never"
                  },
                  "mirrorResponse": {
                    "type": "array",
                    "title": "1-3. How does your child usually respond to seeing themselves in a mirror? (select all that apply)",
                    "items": {
                      "type": "string",
                      "enum": [
                        "smiles",
                        "gets-excited",
                        "laughs",
                        "reaches-toward-mirror", 
                        "doesnt-notice",
                        "gets-upset",
                        "other",
                        "prefer-not-to-answer"
                      ]
                    },
                    "required": false
                  },
                  "mirrorResponseOther": {
                    "type": "string",
                    "title": "If you selected 'Other' above, please specify how your child responds to mirrors:",
                    "required": false
                  },
                  "screenFirstAge": {
                    "type": "string",
                    "title": "2-1. At which age did your child first see themselves on a screen? (e.g., camera app on a smartphone, FaceTime, Zoom) Please provide your answer in MONTHS of age (if you're not sure, please provide your best guess).",
                    "required": false
                  },
                  "screenFrequency": {
                    "enum": [
                      "never",
                      "less-than-weekly",
                      "weekly",
                      "several-times-weekly",
                      "daily",
                      "several-times-daily"
                    ],
                    "type": "string",
                    "title": "2-2. In the last MONTH, how often did your child see themselves on a screen? (e.g., FaceTime on the phone or tablet, Zoom on a computer, ...)",
                    "required": false,
                    "default": "never"
                  },
                  "screenResponse": {
                    "type": "array",
                    "title": "2-3. How does your child usually respond to seeing themselves on a screen? (select all that apply)",
                    "items": {
                      "type": "string",
                      "enum": [
                        "smiles",
                        "gets-excited",
                        "laughs",
                        "reaches-toward-screen",
                        "doesnt-notice",
                        "gets-upset",
                        "other",
                        "prefer-not-to-answer"
                      ]
                    },
                    "required": false
                  },
                  "screenResponseOther": {
                    "type": "string",
                    "title": "If you selected 'Other' above, please specify how your child responds to screens:",
                    "required": false
                  },
                  "videoFirstAge": {
                    "type": "string",
                    "title": "3-1. At which age did your child first see a VIDEO of themselves? Please provide your answer in MONTHS of age (if you're not sure, please provide your best guess).",
                    "required": false
                  },
                  "videoFrequency": {
                    "enum": [
                      "never",
                      "less-than-weekly",
                      "weekly",
                      "several-times-weekly",
                      "daily",
                      "several-times-daily"
                    ],
                    "type": "string",
                    "title": "3-2. In the last MONTH, how often did your child see a VIDEO of themselves? (e.g., on the phone, tablet, computer, video camera, ...)",
                    "required": false,
                    "default": "never"
                  },
                  "videoResponse": {
                    "type": "array",
                    "title": "3-3. How does your child usually respond to seeing a video of themselves? (select all that apply)",
                    "items": {
                      "type": "string",
                      "enum": [
                        "smiles",
                        "gets-excited",
                        "laughs",
                        "reaches-toward-screen",
                        "doesnt-notice",
                        "gets-upset",
                        "other"
                      ]
                    },
                    "required": false
                  },
                  "videoResponseOther": {
                    "type": "string",
                    "title": "If you selected 'Other' above, please specify how your child responds to videos:",
                    "required": false
                  },
                  "interruptions": {
                    "type": "string",
                    "title": "4-1. Did you and/or your child experience any interruptions during the study? (e.g., phone call, alerts or notifications appearing on the computer, person entering the room)",
                    "required": false
                  },
                  "additionalComments": {
                    "type": "string",
                    "title": "4-2. Are there any other comments or feedback you would like to share?",
                    "required": false
                  }
                },
                "dependencies": {
                  "mirrorResponseOther": ["mirrorResponse"],
                  "screenResponseOther": ["screenResponse"],
                  "videoResponseOther": ["videoResponse"]
                }
              },
              "options": {
                "fields": {
                  "introText": {
                    "type": "object",
                    "view": "bootstrap-display"
                  },
                  "mirrorFirstAge": {
                    "type": "text",
                    "placeholder": "e.g., 3",
                    "message": "Please provide an age in months"
                  },
                  "screenFirstAge": {
                    "type": "text",
                    "placeholder": "e.g., 3",
                    "message": "Please provide an age in months"
                  },
                  "videoFirstAge": {
                    "type": "text",
                    "placeholder": "e.g., 3",
                    "message": "Please provide an age in months"
                  },
                  "mirrorFrequency": {
                    "type": "radio",
                    "message": "Please select how frequently your child looks in the mirror",
                    "sort": false,
                    "removeDefaultNone": true,
                    "noneLabel": "",
                    "hideNone": true,
                    "optionLabels": [
                      "Please choose one",
                      "Never",
                      "Less than once a week",
                      "Once a week",
                      "Several times a week",
                      "Once a day",
                      "Several times a day"
                    ]
                  },
                  "screenFrequency": {
                    "type": "radio",
                    "message": "Please select how frequently your child sees themselves on a screen",
                    "sort": false,
                    "removeDefaultNone": true,
                    "noneLabel": "",
                    "hideNone": true,
                    "optionLabels": [
                      "Please choose one",
                      "Never",
                      "Less than once a week",
                      "Once a week",
                      "Several times a week",
                      "Once a day",
                      "Several times a day"
                    ]
                  },
                  "videoFrequency": {
                    "type": "radio",
                    "message": "Please select how frequently your child sees videos of themselves",
                    "sort": false,
                    "removeDefaultNone": true,
                    "noneLabel": "",
                    "hideNone": true,
                    "optionLabels": [
                      "Please choose one",
                      "Never",
                      "Less than once a week",
                      "Once a week",
                      "Several times a week",
                      "Once a day",
                      "Several times a day"
                    ]
                  },
                  "mirrorResponse": {
                    "type": "checkbox",
                    "message": "Please select all responses that apply",
                    "sort": false,
                    "removeDefaultNone": true,
                    "optionLabels": [
                      "Smiles",
                      "Gets excited",
                      "Laughs",
                      "Reaches toward mirror",
                      "Doesn't seem to care/notice",
                      "Gets upset",
                      "Other (please specify)",
                      "Prefer not to answer"
                    ]
                  },
                  "screenResponse": {
                    "type": "checkbox",
                    "message": "Please select all responses that apply",
                    "sort": false,
                    "removeDefaultNone": true,
                    "optionLabels": [
                      "Smiles",
                      "Gets excited",
                      "Laughs",
                      "Reaches toward screen",
                      "Doesn't seem to care/notice",
                      "Gets upset",
                      "Other (please specify)",
                      "Prefer not to answer"
                    ]
                  },
                  "videoResponse": {
                    "type": "checkbox",
                    "message": "Please select all responses that apply",
                    "sort": false,
                    "removeDefaultNone": true,
                    "optionLabels": [
                      "Smiles",
                      "Gets excited",
                      "Laughs",
                      "Reaches toward screen",
                      "Doesn't seem to care/notice",
                      "Gets upset",
                      "Other (please specify)"
                    ]
                  },
                  "mirrorResponseOther": {
                    "type": "text",
                    "placeholder": "Please describe how your child responds",
                    "dependencies": {
                      "mirrorResponse": "other"
                    }
                  },
                  "screenResponseOther": {
                    "type": "text",
                    "placeholder": "Please describe how your child responds",
                    "dependencies": {
                      "screenResponse": "other"
                    }
                  },
                  "videoResponseOther": {
                    "type": "text",
                    "placeholder": "Please describe how your child responds",
                    "dependencies": {
                      "videoResponse": "other"
                    }
                  },
                  "interruptions": {
                    "type": "textarea",
                    "placeholder": "Please describe any interruptions here",
                    "rows": 3
                  },
                  "additionalComments": {
                    "type": "textarea",
                    "placeholder": "Please share any additional comments here",
                    "rows": 3
                  }
                },
                "hideInitValidationError": true
              }
            }
          },


          "exit-survey": {
              "kind": "exp-lookit-exit-survey",
              "debriefing": {
                  "title": "Thank you for participating!",
                  "blocks": [{
                          "title": "",
                          "text": "This research wouldn't be possible without awesome parents like you."
                      },
                      {
                          "title": "Some Background Information:",
                          "text": "One of the first things an infant encounters is themselves, but we know only little about the nature and origins of the 'self' and how it may change throughout development. In this study, we aim to broadly explore how infants at the very beginning of their development react and behave when seeing themselves on a screen, and how their responses compare to seeing other babies who aren’t them."
                      },
                      {
                          "title": "Additional Resources:",
                          "text": "To learn more about this topic, you can check out some of the following works and resources:<br><a href='https://youtu.be/M2I0kwSua44?si=Sc_Q7Ex0bFOmh0KB' target='_blank'>A video about the Mirror Task</a><br><a href='https://www.youtube.com/watch?v=y1KIVZw7Jxk' target='_blank'>TED Talk by Laura Schulz: The surprisingly logical minds of babies</a>"
                      },
                      {
                          "title": "Compensation:",
                          "text": "To thank you for your participation, we'll be emailing you a $5 USD Amazon gift card - this should arrive in your inbox within the next week after we confirm your consent video and check that your child is in the age range for this study (If you don't hear from us by then, feel free to reach out!). If you participate again with another child in the age range, you'll receive one gift card per child."
                      },
                      {
                          "title": "Questions or Concerns:",
                          "text": "Please do not hesitate to contact Hyowon Gweon at sll_lookit@stanford.edu"
                      }
                  ]
              }
          },
          
          
          "mirror-self-view-trial": {
            "kind": "exp-lookit-mirror",
            "duration": 180,
            "songUrl": "https://github.com/sociallearninglab/baby_view_other_baby/blob/main/mp3/song.mp3",
            "instructionText": "Look at the silly baby!",
            "nextButtonText": "Done",
            "forceFullscreen": true,
            "startRecordingAutomatically": true
        }



      },
      sequence: [
          'welcome',
          'video-config',
          'video-consent',
          'video-use-consent-survey',
          'audio-check',          
          'instruction-video',
          'instructions-3',
          'webcam-display-check',
          'start-recording',
          'mirror-trial',
          'stop-recording',
          'study-outro',
          "mirror-questions",
          'exit-survey',
          'email-survey'
      ]
  };
}