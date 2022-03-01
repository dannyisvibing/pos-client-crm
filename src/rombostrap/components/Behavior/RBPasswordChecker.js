import zxcvbn from 'zxcvbn';

class RBPasswordChecker {
  check(newValue, oldValue, score) {
    if (!score.result) {
      score.result = {};
    }

    if (newValue !== undefined && newValue !== oldValue) {
      if (newValue === '') {
        score.meterValue = 0;
        score.textScore = '';
      } else {
        const result = zxcvbn(newValue);
        score.result = result;
        score.meterValue = result.score + 1;
      }
    }

    return score;
  }
}

const rbPasswordCheckerInstance = new RBPasswordChecker();
export default rbPasswordCheckerInstance;
