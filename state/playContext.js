import * as React from "react";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { useGlobalContext } from "../state/globalContext";

// active player song data
const initialState = {
  sound: null,
  episode: null,
  isPlaying: false,
  currentProgress: {},
};

const PlayContext = React.createContext(initialState);

const reducer = (prevState, action) => {
  switch (action.type) {
    case "LOAD_PLAY":
      SecureStore.setItemAsync(
        "currentEpisode",
        JSON.stringify(action.payload.episode)
      );
      if (prevState && prevState.sound && prevState.sound.unloadAsync) {
        prevState.sound?.unloadAsync();
      }
      return {
        ...prevState,
        sound: action.payload.sound,
        episode: action.payload.episode,
        isPlaying: true,
      };
    case "PLAY":
      prevState.sound?.playAsync();
      return {
        ...prevState,
        isPlaying: true,
      };
    case "PAUSE":
      prevState.sound?.pauseAsync();
      return {
        ...prevState,
        isPlaying: false,
      };
    case "ADD_PROGRESS":
      const tempCurrentProgress = prevState.currentProgress;
      const episodeId = action.payload.episodeId;
      const progress = action.payload.progress;
      SecureStore.setItemAsync(
        "allProgress",
        JSON.stringify(tempCurrentProgress)
      );
      if (tempCurrentProgress && episodeId) {
        tempCurrentProgress[episodeId] = {
          progress,
        };
      }

      return {
        ...prevState,
        currentProgress: tempCurrentProgress,
      };
    case "LOAD_FROM_STORE":
      return {
        ...prevState,
        currentProgress: action.payload.allProgress,
        episode: action.payload.currentEpisode,
      };
  }
};

export const PlayContextProvider = ({ children }) => {
  const [playState, dispatch] = React.useReducer(reducer, initialState);
  const { state } = useGlobalContext();

  React.useEffect(() => {
    const loadProgressFromStorage = async () => {
      try {
        const allProgress = JSON.parse(
          await SecureStore.getItemAsync("allProgress")
        );
        const currentEpisode = JSON.parse(
          await SecureStore.getItemAsync("currentEpisode")
        );
        if (allProgress) {
          dispatch({
            type: "LOAD_FROM_STORE",
            payload: {
              allProgress,
              currentEpisode,
            },
          });
        }
      } catch (e) {
        console.log(e);
        return;
      }
    };

    loadProgressFromStorage();
  }, []);
  const playActions = React.useMemo(
    () => ({
      loadAndPlay: async ({ episode, episodeIndex }) => {
        const onPlaybackStatusUpdate = (playbackStatus) => {
          if (!playbackStatus.isLoaded) {
            // Update your UI for the unloaded state
            if (playbackStatus.error) {
              console.log(
                `Encountered a fatal error during playback: ${playbackStatus.error}`
              );
              // Send Expo team the error on Slack or the forums so we can help you debug!
            }
          } else {
            dispatch({
              type: "ADD_PROGRESS",
              payload: {
                episodeId: episode.id,
                progress: playbackStatus.positionMillis,
              },
            });

            // Update your UI for the loaded state
            if (playbackStatus.isPlaying) {
              // Update your UI for the playing state
            } else {
              // Update your UI for the paused state
            }

            if (playbackStatus.isBuffering) {
              // Update your UI for the buffering state
            }

            if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
              // console.log(state.series[episode.folder].episodeIds);
              //The player has just finished playing and will stop. Maybe you want to play something else?
              const foundIndex = state.series.findIndex(
                (serie) => serie.title === episode.folder
              );

              const nextEpisodeId =
                state.series[foundIndex]?.episodeIds[episodeIndex + 1];
              if (nextEpisodeId) {
                const nextEpisode = state.episodes[nextEpisodeId];
                playActions.loadAndPlay({
                  episode: nextEpisode,
                  episodeIndex: episodeIndex + 1,
                });
              } else {
                playActions.pause();
              }
            }
          }
        };
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            playThroughEarpieceAndroid: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          });
        } catch (e) {
          console.log(JSON.stringify(e));
        }
        const allProgress = JSON.parse(
          await SecureStore.getItemAsync("allProgress")
        );
        let lastProgress = 0;
        if (allProgress && allProgress[episode.id]) {
          lastProgress = allProgress[episode.id]?.progress;
        }
        const { sound } = await Audio.Sound.createAsync(
          {
            uri: episode.audioUrl,
          },
          { positionMillis: lastProgress || 0 }
        );

        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

        await sound.playAsync();
        dispatch({
          type: "LOAD_PLAY",
          payload: {
            sound,
            episode,
          },
        });
      },
      pause: async () => {
        dispatch({
          type: "PAUSE",
        });
      },
      play: async () => {
        dispatch({
          type: "PLAY",
        });
      },
    }),
    []
  );

  const value = { playState, playActions };
  return <PlayContext.Provider value={value}>{children}</PlayContext.Provider>;
};

export const usePlayContext = () => React.useContext(PlayContext);
