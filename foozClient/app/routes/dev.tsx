import { MatchCard } from "~/components/MatchCard";

const DevPage = () => {
  var match = JSON.parse(
    '{    "id": "8014e187-22ab-4daf-8cae-808ca2f32822",    "roundId": "fb60116b-ab60-4472-a96d-361cef961c52_0",    "matchNumber": 0,    "isCompleted": false,    "team1": {      "id": "332698e4-ee44-4416-9de1-f13b62f4f48f",      "roundId": "fb60116b-ab60-4472-a96d-361cef961c52_0",      "player1": {        "id": "b0c6a68c-b487-4717-bee0-3ab2443fb3f6",        "name": "string3",        "score": 0,        "weigth": 5      },      "player2": {        "id": "07e15cc7-c79a-4dda-a508-e04bbd02f728",        "name": "string4",        "score": 0,        "weigth": 5      },      "score": 0    },    "team1Score": 0,    "team2": {      "id": "9f29ae74-0639-4ad7-866c-5d2f035774a9",      "roundId": "fb60116b-ab60-4472-a96d-361cef961c52_0",      "player1": {        "id": "06032b16-a52a-4593-9a52-b130fa2c6110",        "name": "string1",        "score": 0,        "weigth": 5      },      "player2": {        "id": "e4fb161b-f2e2-402d-8f82-cf5b18132351",        "name": "string2",        "score": 0,        "weigth": 5      },      "score": 0    },    "team2Score": 0  }'
  );
  return (
    <div>
      <MatchCard match={match} />
    </div>
  );
};

export default DevPage;
