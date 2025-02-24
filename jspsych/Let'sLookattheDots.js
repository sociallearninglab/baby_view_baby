function generateProtocol(child, pastSessions) {
    let trial_types = ['linear', 'ushaped', 'sinusoidal'];
    let trial_type = trial_types[Math.floor(Math.random() * trial_types.length)];

    var fam_trial_num = 6; // Familiarization trials should appear 6 times
    var test_trial_num = 4; // There are 4 test trials, each should appear once
    var trial_duration = 60; // Test trials should stay on screen for 60 seconds
    var trial_type_order = 2;

    // Function to get random contrast based on the assigned trial type (once)
    let contrast = getContrasts(trial_type);
    function getContrasts(trial_type) {
        if (trial_type === 'linear') {
            return ['linear', Math.random() > 0.5 ? 'ushaped' : 'sinusoidal'];
        } else if (trial_type === 'ushaped') {
            return ['ushaped', Math.random() > 0.5 ? 'linear' : 'linear'];
        } else if (trial_type === 'sinusoidal') {
            return ['sinusoidal', Math.random() > 0.5 ? 'linear' : 'linear'];
        }
    }

    // Define the test trials based on the assigned trial type and the fixed contrast
    let testA = `fam-testA-${contrast[0]}`; // Component 1 (e.g., sinusoidal)
    let testB = `fam-testB-${contrast[1]}`; // Component 2 (e.g., linear)
    
    // Determine the order of the test trials
    let order;
    if (trial_type_order == 1) {
        order = ['testA', 'testB', 'testA', 'testB'];
    } else {
        order = ['testB', 'testA', 'testB', 'testA'];
    }

    let fam_scene = `fam-${trial_type}`; // e.g., fam-linear, fam-ushaped, fam-sinusoidal

    let all_trials = [];
    
    // Add familiarization trials
for (let i = 0; i < fam_trial_num; i++) {
    all_trials.push('attention-getter'); // Add regular attention-getter for all trials
    all_trials.push(fam_scene);          // Add familiarization scene
}

// Add attention-getter-halfway after all familiarization trials
all_trials.push('attention-getter-halfway');

    // Add test trials (each plays once, stays on screen for 60 seconds)
    for (let i = 0; i < test_trial_num; i++) {
        all_trials.push('attention-getter');

        // Use the alternating order based on the `order` array
        if (order[i] === 'testA') {
            all_trials.push(testA);
        } else {
            all_trials.push(testB);
        }
    }
    // Define all possible frames that might be used
    let frames = {
        "video-config": {
            "kind": "exp-video-config",
            "troubleshootingIntro": "If you're having any trouble getting your webcam set up, please feel free to send Nicole Coates an email at <b>nhcoates@mit.edu</b> and we'd be glad to help you out!"
        },
        "video-consent": {
            "kind": "exp-lookit-video-consent",
            "template": "consent_005",
            "PIName": "Laura Schulz",
            "institution": "Massachusetts Institute of Technology",
            "PIContact": "Laura Schulz at (617) 253-7957",
            "purpose": "Are babies sensitive to functional forms? This study will help us understand whether babies detect different types of functions from each other.",
            "procedures": "Your child will be shown a series of animated displays in which dots appear over time. We are interested in how much attention your child pays to the displays we show them!",
            "risk_statement": "There are no expected risks if you participate in the study.",
            "payment": "After you finish the study, we will email you a $5 amazon gift card. To be eligible for the gift card your child must be in the age range for this study, you need to submit a valid consent statement, and we need to see that there is a child with you. But we will send a gift card even if you do not finish the whole study or we are not able to use your child's data! There are no other direct benefits to you or your child from participating, but we hope you will enjoy the experience.",
            "datause": "We are primarily interested in your child's looking behavior. A research assistant will watch your video to measure the duration of time your child spends looking at the different scenarios we show them.",
            "include_databrary": true,
            "gdpr": false,
            "research_rights_statement": "You are not waiving any legal claims, rights or remedies because of your participation in this research study.  If you feel you have been treated unfairly, or you have questions regarding your rights as a research subject, you may contact the Committee on the Use of Humans as Experimental Subjects at MIT via couhes@mit.edu regarding study protocol 2003000107."
        },
        "study-intro": {
            "blocks": [{
                    "emph": true,
                    "text": "Your child does not need to be with you until the videos begin. First, here's what will happen!",
                    "title": "Overview of the study"
                },
                {
                    "text": "During this study, your child will watch videos of dots appearing over time to create a functional form."
                },
                {
                    "text": "You’ll have a chance to preview the videos ahead of time. After reading the instructions you’ll start the experiment when you and your child are ready."
                },
                {
                    "text": "The video section will take about 5-7 minutes."
                },
                {
                    "text": "After the videos, you will answer a few final questions. Then you're all done!"
                },
                {
                    "text": "Before you start, please think about which room would be best suited for the study. Ideally, the location would be quiet, and relatively distraction-free. We realize this is not always possible."
                }
            ],
            "showPreviousButton": false,
            "kind": "exp-lookit-text"
        },
        "instructions-1": {
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
                            "text": "Then, we'll play some videos for your child to watch. The videos should take about 5-7 minutes."
                        },
                    ]
                },
                {
                    "text": "Please turn the volume up so it's easy to hear but still comfortable.",
                    "title": "First thing's first: checking your audio.",
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
        "instructions-2": {
            "kind": "exp-lookit-instructions",
            "displayFullscreen": false,
            "blocks": [{
                "title": "Play the video below to see what will happen during the study.",
                "mediaBlock": {
                    "isVideo": true,
                    "sources": [{
                        "src": "https://github.com/nicolehope5/lookit-stimuli-template/raw/refs/heads/master/mp4/instructions.mp4",
                        "type": "video/mp4"
                    }],
                    "mustPlay": true,
                    "warningText": "Please finish watching the video."

                }
            }, ],
            "nextButtonText": "More instructions!"
        },
        "instructions-3": {
            "kind": "exp-lookit-instructions",
            "restartAfterPause": true,
            "blocks": [{
                "title": "Deciding when your child is done with the trial.",
                "listblocks": [{
                        "text": "In this study, we also ask parents to help us determine when their child has finished looking at each trial."
                    },
                    {
                        "text": "To do that, we ask that when your child has looked away, start counting slowly, and <b> if your child is still looking away after three seconds, please press the space bar</b>. If your child looks back on the screen before three seconds have passed, you can stop counting, and start again once they look away."
                    },
                    {
                        "text": "Let's see how that looks in practice! You'll see a video of a child from the back and the front, similarly to how you will see your own child during the study. You can pay attention to whether the child is looking and press the space bar when the child has looked away for three seconds in a row."
                    },
                    {
                        "text": "<b>Don't worry about getting it exactly right</b>, pressing the spacebar after slowly counting to three is great!"
                    }
                ]
            }, ],
            "nextButtonText": "See example!"
        },
        "instructions-4": {
            "kind": "exp-lookit-video-infant-control",
            "endTrialKey": " ",
            "pauseKey": "p",
            "pausedText": "Study paused \n\n Press 'p' to resume",
            "audio": {
                "loop": false,
                "source": "peekaboo"
            },
            "video": {
                "position": "fill",
                "source": "parent-control-practice-front"
            },
            "backgroundColor": "white",
            "autoProceed": true,
            "parentTextBlock": {
                "text": "Here you see a parent stopping the trial after their child has turned their head for about three seconds in a row. Notice the parent isn't stopping the trial for short looks away!"
            },
            "requiredDuration": 0,
            "requireAudioCount": 0,
            "requireVideoCount": 1,
            "restartAfterPause": true,
            "pauseVideo": "attentiongrabber",
            "doRecording": false,
            "baseDir": "https://github.com/nicolehope5/lookit-stimuli-template/raw/master/",
            "audioTypes": [
                "mp3"
            ],
            "videoTypes": [
                "mp4"
            ]
        },
        "instructions-5": {
            "kind": "exp-lookit-video-infant-control",
            "endTrialKey": " ",
            "pauseKey": "p",
            "pausedText": "Study paused \n\n Press 'p' to resume",
            "audio": {
                "loop": false,
                "source": "peekaboo"
            },
            "video": {
                "position": "fill",
                "source": "parent-control-practice-back"
            },
            "backgroundColor": "white",
            "autoProceed": true,
            "parentTextBlock": {
                "text": "Let's practice this. <b> Press the spacebar when the child has looked away for approx. three seconds in a row! </b>"
            },
            "requiredDuration": 0,
            "requireAudioCount": 0,
            "requireVideoCount": 1,
            "restartAfterPause": true,
            "pauseVideo": "attentiongrabber",
            "doRecording": false,
            "baseDir": "https://github.com/nicolehope5/lookit-stimuli-template/raw/master/",
            "audioTypes": [
                "mp3"
            ],
            "videoTypes": [
                "mp4"
            ]
        },
        "instructions-6": {
            "kind": "exp-lookit-instructions",
            "blocks": [{
                    "title": "Well done!",
                    "listblocks": [{
                            "text": "We hope you got a bit of a feeling for how to stop trials during the study. It is not essential that you stop after exactly three seconds, so don't worry that you're doing something wrong. You can count '1-Mississippi, 2-Mississippi' etc. "
                        },
                        {
                            "text": "It can be hard to see where your child is looking from behind, and that's ok. You don't need to peek over their shoulder to see where they are looking, as that might distract them away from the screen. You can start counting when they turn their away head."
                        },
                    ]
                },
                {
                    "text": "Are you ready? Let's get set up!"
                }
            ],
            "nextButtonText": "Set up instructions",
        },
        "instructions-7": {
            "kind": "exp-lookit-instructions",
            "blocks": [{
                    "title": "Let's get set-up:"
                },
                {
                    "text": "If possible, complete the study in a quiet room, away from windows, open doorways, toys, pets, siblings - interesting things to look at and reach for. For example, a home office is better than a busy kitchen (We understand if not all of this is possible!). \n\n",
                    "image": {
                        "alt": "No distractions",
                        "src": "https://www.mit.edu/~kimscott/intermodal/img/distractions.png"
                    }
                },
                {
                    "text": "\n\n Please make sure your webcam is centered on the screen (this should be the case for most laptops). \n\n ",
                    "image": {
                        "alt": "Center camera",
                        "src": "https://www.mit.edu/~kimscott/intermodal/img/centering.png"
                    }
                },
                {
                    "text": "\n\n If you are using two monitors, please turn one of them off. \n\n ",
                    "image": {
                        "alt": "Turn off monitor",
                        "src": "https://www.mit.edu/~kimscott/intermodal/img/monitors.png"
                    }
                },
                {
                    "text": "\n\n Please put the laptop or computer close to the baby, but far enough so that they can't reach forward and touch anything. \n\n ",
                },

                {
                    "text": "\n\n Now, you can go ahead and put your child in a high chair and stand or sit behind them. \n\n",
                    "image": {
                        "alt": "Child in high chair",
                        "src": "https://raw.githubusercontent.com/GalRaz/mcs_lookit_stims/master/baby_high_chair.jpg",
                        "width": 50
                    }
                },
                {
                    "text": "\n\n If there is no high chair available, having your child on your lap is also ok. \n\n",
                    "image": {
                        "alt": "Child on lap",
                        "src": "https://raw.githubusercontent.com/GalRaz/mcs_lookit_stims/master/baby_on_lap.jpg"
                    }
                },
                {
                    "title": "Some final pointers",
                    "listblocks": [{
                            "text": "<b> Don’t worry if your child isn’t looking at the screen the entire time!</b> There's no need to direct your child's attention towards the screen, since we want to see the decisions your child makes on their own! You can just try to keep their body oriented towards the screen so they can look if they want to. "
                        },
                        {
                            "text": "Try to avoid peeking over your child's shoulder to see what they're doing. We want to make sure your child isn't distracted away from the screen, when they would've looked otherwise!"
                        },
                        {
                            "text": "If you can do the entire study in one go, that's great. But you can also pause the study (press 'p') or stop the study (press esc-key) at any point."
                        },
                        {
                            "text": "During the trials with the animated creatures, <b> press the spacebar when your child has looked away for approx. 3 seconds!"
                        },
                    ]
                },
                {
                    "title": "Ready?",
                    "listblocks": [{
                        "text": "If your child is set up, go ahead and press the 'Check video!' button."
                    }]
                }
            ],
            "nextButtonText": "Check video!"
        },
        "webcam-display-check": {
            "kind": "exp-lookit-webcam-display",
            "blocks": [{
                "title": "Last check: Does the video look good? Are your child's eyes visible?",
                "listblocks": [{
                    "text": "If so, you can go ahead and start the videos! The experiment will start once you press the button. See you in about 5-7 minutes!"
                }, ]

            }],
            "nextButtonText": "Start the videos!",
            "showPreviousButton": false,
            "displayFullscreenOverride": true,
            "startRecordingAutomatically": false
        },
        "halfway-mark": {
            "kind": "exp-lookit-instructions",
            "blocks": [{
                "title": "We're halfway there!",
                "text": "You're doing great!"
            }],
            "nextButtonText": "Keep going.",
        },
        "start-recording-with-image": {
            "kind": "exp-lookit-start-recording",
            "baseDir": "https://www.mit.edu/~kimscott/placeholderstimuli/",
            "videoTypes": [
                "mp4"
            ],
            "image": "peekaboo_remy.jpg",
            "imageAnimation": "spin",
            "displayFullscreen": true
        },
        "stop-recording-with-image": {
            "kind": "exp-lookit-stop-recording",
            "baseDir": "https://www.mit.edu/~kimscott/placeholderstimuli/",
            "videoTypes": [
                "mp4"
            ],
            "image": "peekaboo_remy.jpg",
            "imageAnimation": "spin",
            "displayFullscreen": true
        },
        "attention-getter": {
            "kind": "exp-lookit-video",
            "pausedText": "Study paused \n\n Press 'p' to resume",
            "pauseKey": "p",
            "restartAfterPause": true,
            "video": {
                "loop": false,
                "position": "fill",
                "source": "shari_attngetter"
            },
            "backgroundColor": "white",
            "autoProceed": true,
            "requiredDuration": 0,
            "requireAudioCount": 0,
            "requireVideoCount": 1,
            "doRecording": false,
            "showWaitForRecordingMessage": false,
            "showWaitForUploadMessage": false,
            "frameOffsetAfterPause": 0,
            "pauseAudio": "pause",
            "pauseVideo": "attentiongrabber",

            "baseDir": "https://raw.githubusercontent.com/GalRaz/mcs_lookit_stims/master/resources",
            "audioTypes": [
                "mp3"
            ],
            "videoTypes": [
                "mp4"
            ]
        },
        "attention-getter-halfway": {
            "kind": "exp-lookit-video",
            "pausedText": "Study paused \n\n Press 'p' to resume",
            "pauseKey": "p",
            "video": {
                "loop": false,
                "position": "fill",
                "source": "fam_attngetter"
            },
            "parentTextBlock": {
                "text": "<b> You're halfway there! </b>"
            },
            "backgroundColor": "white",
            "autoProceed": true,
            "requiredDuration": 0,
            "requireAudioCount": 0,
            "requireVideoCount": 2,
            "doRecording": false,
            "showWaitForRecordingMessage": false,
            "showWaitForUploadMessage": false,
            "frameOffsetAfterPause": 0,
            "pauseVideo": "attentiongrabber",
            "baseDir": "https://raw.githubusercontent.com/GalRaz/mcs_lookit_stims/master/resources",
            "restartAfterPause": true,
            "audioTypes": [
                "mp3"
            ],
            "videoTypes": [
                "mp4"
            ],
            "selectNextFrame": "function(frames, frameIndex, frameData, expData, sequence, child, pastSessions) {console.log(expData); nextFrame = frameIndex +1; return nextFrame}"
        },

        "fam-linear": {
            "kind": "exp-lookit-video-infant-control",
            "endTrialKey": " ",
            "pauseKey": "p",
            "restartAfterPause": true,
            "pausedText": "Study paused \n\n Press 'p' to resume",
            "video": {
                "loop": true,
                "position": "fill",
                "source": "fam_linear"
            },
            "backgroundColor": "white",
            "autoProceed": true,
            "requiredDuration": trial_duration,
            "requireAudioCount": 0,
            "requireVideoCount": 0,
            "doRecording": false,
            "showWaitForRecordingMessage": false,
            "showWaitForUploadMessage": false,
            "frameOffsetAfterPause": 0,
            "baseDir": "https://github.com/nicolehope5/lookit-stimuli-template/raw/master/",
            "videoTypes": ["mp4"]
        },
        "fam-testA-linear": {
            "kind": "exp-lookit-video-infant-control",
            "endTrialKey": " ",
            "pauseKey": "p",
            "pausedText": "Study paused \n\n Press 'p' to resume",
            "restartAfterPause": true,
            "video": {
                "loop": false,
                "position": "fill",
                "source": "linear_parameter_change"
            },
            "backgroundColor": "white",
            "autoProceed": true,
            "requiredDuration": trial_duration,
            "requireAudioCount": 0,
            "requireVideoCount": 0,
            "doRecording": false,
            "showWaitForRecordingMessage": false,
            "showWaitForUploadMessage": false,
            "frameOffsetAfterPause": 0,
            "baseDir": "https://github.com/nicolehope5/lookit-stimuli-template/raw/master/",
            "videoTypes": ["mp4"]
        },
        "fam-testB-ushaped": {
            "kind": "exp-lookit-video-infant-control",
            "endTrialKey": " ",
            "pauseKey": "p",
            "restartAfterPause": true,
            "pausedText": "Study paused \n\n Press 'p' to resume",
            "video": {
                "loop": false,
                "position": "fill",
                "source": "U-shaped_parameter_change"
            },
            "backgroundColor": "white",
            "autoProceed": true,
            "requiredDuration": trial_duration,
            "requireAudioCount": 0,
            "requireVideoCount": 0,
            "doRecording": false,
            "showWaitForRecordingMessage": false,
            "showWaitForUploadMessage": false,
            "frameOffsetAfterPause": 0,
            "baseDir": "https://github.com/nicolehope5/lookit-stimuli-template/raw/master/",
            "videoTypes": ["mp4"]
        },

        "fam-sinusoidal": {
            "kind": "exp-lookit-video-infant-control",
            "endTrialKey": " ",
            "pauseKey": "p",
            "restartAfterPause": true,
            "pausedText": "Study paused \n\n Press 'p' to resume",
            "video": {
                "loop": true,
                "position": "fill",
                "source": "fam_sine"
            },
            "backgroundColor": "white",
            "autoProceed": true,
            "requiredDuration": trial_duration,
            "requireAudioCount": 0,
            "requireVideoCount": 0,
            "doRecording": false,
            "showWaitForRecordingMessage": false,
            "showWaitForUploadMessage": false,
            "frameOffsetAfterPause": 0,
            "baseDir": "https://github.com/nicolehope5/lookit-stimuli-template/raw/master/",
            "videoTypes": ["mp4"]
        },

        "fam-testA-sinusoidal": {
            "kind": "exp-lookit-video-infant-control",
            "endTrialKey": " ",
            "pauseKey": "p",
            "pausedText": "Study paused \n\n Press 'p' to resume",
            "restartAfterPause": true,
            "video": {
                "loop": false,
                "position": "fill",
                "source": "sine_parameter_change"
            },
            "backgroundColor": "white",
            "autoProceed": true,
            "requiredDuration": trial_duration,
            "requireAudioCount": 0,
            "requireVideoCount": 0,
            "doRecording": false,
            "showWaitForRecordingMessage": false,
            "showWaitForUploadMessage": false,
            "frameOffsetAfterPause": 0,
            "baseDir": "https://github.com/nicolehope5/lookit-stimuli-template/raw/master/",
            "videoTypes": ["mp4"]
        },
        "fam-testB-sinusoidal": {
            "kind": "exp-lookit-video-infant-control",
            "endTrialKey": " ",
            "pauseKey": "p",
            "pausedText": "Study paused \n\n Press 'p' to resume",
            "restartAfterPause": true,
            "video": {
                "loop": false,
                "position": "fill",
                "source": "sine_parameter_change"
            },
            "backgroundColor": "white",
            "autoProceed": true,
            "requiredDuration": trial_duration,
            "requireAudioCount": 0,
            "requireVideoCount": 0,
            "doRecording": false,
            "showWaitForRecordingMessage": false,
            "showWaitForUploadMessage": false,
            "frameOffsetAfterPause": 0,
            "baseDir": "https://github.com/nicolehope5/lookit-stimuli-template/raw/master/",
            "videoTypes": ["mp4"]
        },

        "fam-testB-linear": {
            "kind": "exp-lookit-video-infant-control",
            "endTrialKey": " ",
            "pauseKey": "p",
            "pausedText": "Study paused \n\n Press 'p' to resume",
            "restartAfterPause": true,
            "video": {
                "loop": false,
                "position": "fill",
                "source": "linear_parameter_change"
            },
            "backgroundColor": "white",
            "autoProceed": true,
            "requiredDuration": trial_duration,
            "requireAudioCount": 0,
            "requireVideoCount": 0,
            "doRecording": false,
            "showWaitForRecordingMessage": false,
            "showWaitForUploadMessage": false,
            "frameOffsetAfterPause": 0,
            "baseDir": "https://github.com/nicolehope5/lookit-stimuli-template/raw/master/",
            "videoTypes": ["mp4"]
        },

        "fam-ushaped": {
            "kind": "exp-lookit-video-infant-control",
            "endTrialKey": " ",
            "pauseKey": "p",
            "restartAfterPause": true,
            "pausedText": "Study paused \n\n Press 'p' to resume",
            "video": {
                "loop": true,
                "position": "fill",
                "source": "fam_U-shaped"
            },
            "backgroundColor": "white",
            "autoProceed": true,
            "requiredDuration": trial_duration,
            "requireAudioCount": 0,
            "requireVideoCount": 0,
            "doRecording": false,
            "showWaitForRecordingMessage": false,
            "showWaitForUploadMessage": false,
            "frameOffsetAfterPause": 0,
            "baseDir": "https://github.com/nicolehope5/lookit-stimuli-template/raw/master/",
            "videoTypes": ["mp4"]
        },

        "fam-testA-ushaped": {
            "kind": "exp-lookit-video-infant-control",
            "endTrialKey": " ",
            "pauseKey": "p",
            "pausedText": "Study paused \n\n Press 'p' to resume",
            "restartAfterPause": true,
            "video": {
                "loop": false,
                "position": "fill",
                "source": "U-shaped_parameter_change"
            },
            "backgroundColor": "white",
            "autoProceed": true,
            "requiredDuration": trial_duration,
            "requireAudioCount": 0,
            "requireVideoCount": 0,
            "doRecording": false,
            "showWaitForRecordingMessage": false,
            "showWaitForUploadMessage": false,
            "frameOffsetAfterPause": 0,
            "baseDir": "https://github.com/nicolehope5/lookit-stimuli-template/raw/master/",
            "videoTypes": ["mp4"]
        },

        "study-outro": {
            "blocks": [{
                    "emph": true,
                    "title": "We're all done! Awesome job!"
                },
                {
                    "text": "The last thing left to do is to fill out a short exit survey, where you'll be asked about to confirm some information and select your level of privacy. Once you submit that survey, there'll be a little debrief where we give more background information about the study and provide some links where you can find out more on your own.",

                }
            ],
            "showPreviousButton": false,
            "kind": "exp-lookit-text",
        },
        "feedback": {
            "kind": "exp-lookit-survey",
            "formSchema": {
                "schema": {
                    "type": "object",
                    "title": "We would love to hear your feedback, if you have any.",
                    "properties": {
                        "name": {
                            "title": "Did you notice anything strange? Were any instructions unclear? Did something go particularly well?",
                            "type": "string",
                            "required": false
                        },
                    }
                },
                "options": {
                    "fields": {
                        "name": {
                            "placeholder": "You can put your thoughts here."
                        },
                    }
                }
            },
            "nextButtonText": "Finish."
        },
        "exit-survey": {
            "kind": "exp-lookit-exit-survey",
            "debriefing": {
                "text": "You're all done.",
                "blocks": [{
                        "title": "Thank you so much for participating! You will receive an email with your $5 amazon voucher within about a week.",
                        "emph": true,
                        "text": "Below is a little debriefing, to tell you more about our study. Feel free to skip this part if you want."
                    },
                    {
                        "text": "During this study, your child saw videos of animated agents trying to get to a goal."
                    },
                    {
                        "text": "There were three types of videos in every section. "
                    },
                    {
                        "text": "First, your child saw an 'attention-getter' (the rotating star), which was to make sure that all children are attending at the start of every video, i.e. there are all on the same page."
                    },
                    {
                        "text": "Then, your child saw what we call 'familiarization' trials, which we showed your child to get them used to some scenario, for example an agent trying to reach an object behind a barrier and repeatedly jumping over the barrier to achieve its goal."
                    },
                    {
                        "text": "At the end of the familiarization, your child repeatedly saw 'test events', which is the the trials where we measured your child's interest. The test trials are situations in which the obstacle was no longer there, and then the agent approached the object either directly, or by jumping or taking a detour even though there was no obstacle anymore."
                    },
                    {
                        "text": "If babies have some intuitions about how agents achieve their goals, and in particular expect them to reach their goal in the most efficient manner (i.e. taking the direct path to the object), then they should be surprised when the agent jumps on the way to the goal even when there is no obstacle. We measure this 'surprise' by recording the amount of time your child looked on the screen. That is, if the child looked longer at the agent jumping than the agent taking the direct path, we infer that babies might have some prior expectation that agents act efficiently in order to achieve their goals. This helps us better understand the origins of how we think about other agents."
                    },
                    {
                        "title": "If you are interested in learning more about this or other topics in baby research, you can check out some of the links below. Make sure to open the links in a new tab, otherwise you will navigate away from this site and not be able to go back.):",
                        "listblocks": [{
                                "text": "<a href='https://www.child-encyclopedia.com/topics-a-z'>Encyclopedia on Early Childhood Development</a>."
                            },
                            {
                                "text": "<a href='https://www.mitkidsbrains.com/'>Our lab website for learning about and participating in research</a>."
                            },
                            {
                                "text": "<a href='https://childrenhelpingscience.com/'>Children Helping Science: Another platform to find online studies for toddlers and kids.</a>."
                            },
                            {
                                "text": "You can also always send me an email to nhcoates@mit.edu with any questions you might have!"
                            },
                        ]
                    }
                ]
            }
        }
    }


    // Construct the frame sequence
    let frame_sequence = [
        "video-config",
        "video-consent",
        "instructions-1",
        "instructions-2",
        "instructions-3",
        "instructions-4",
        "instructions-5",
        "instructions-6",
        "instructions-7",
        "webcam-display-check",
        'start-recording-with-image',
        'stop-recording-with-image',
        "study-outro",
        "feedback",
        "exit-survey"
    ];

    // Insert familiarization and test trials into the sequence
    let all_trial_pos = frame_sequence.indexOf('start-recording-with-image');
    frame_sequence.splice(all_trial_pos + 1, 0, ...all_trials); // Insert trials

    // Flatten the frame sequence
    frame_sequence = frame_sequence.flat();

    // Return the protocol
    return {
        frames: frames,
        sequence: frame_sequence
    }
}