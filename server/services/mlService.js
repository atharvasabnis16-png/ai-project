import { spawn } from 'child_process';

export const predictMemberPerformance = (memberData) => {
  return new Promise((resolve) => {
    const input = JSON.stringify({
      age: memberData.age || 22,
      years_experience: memberData.yearsExperience || 1,
      education_level: memberData.educationLevel || 'Bachelor',
      department: memberData.department || 'HR',
      performance_score: memberData.performanceScore || 5
    });

    const python = spawn('python', ['server/ml/predict.py', input]);
    let output = '';
    let error = '';

    python.stdout.on('data', (data) => { output += data.toString(); });
    python.stderr.on('data', (data) => { error += data.toString(); });

    python.on('close', (code) => {
      try {
        const result = JSON.parse(output);
        resolve({ success: true, ...result });
      } catch {
        resolve({
          success: false,
          error: error || 'Prediction failed',
          performance_category: 'Average',
          confidence: 0
        });
      }
    });
  });
};

export const rankMembersForTask = async (members) => {
  const categoryScore = {
    'Excellent': 4,
    'Good': 3,
    'Average': 2,
    'Poor': 1
  };

  const results = await Promise.all(
    members.map(async (member) => {
      const prediction = await predictMemberPerformance(member);
      return {
        member,
        prediction,
        score: categoryScore[prediction.performance_category] || 2,
        confidence: prediction.confidence || 0
      };
    })
  );

  return results.sort((a, b) =>
    b.score - a.score || b.confidence - a.confidence
  );
};
