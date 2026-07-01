import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const calculateMatchScore = async (
  studentSkills: string[],
  studentCourse: string | null,
  jobSkills: string[],
  jobTitle: string,
  jobDescription: string,
): Promise<{ score: number; reason: string }> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are an internship matching assistant. Calculate a match score between a student and a job posting.

Student Profile:
- Skills: ${studentSkills.length > 0 ? studentSkills.join(', ') : 'None listed'}
- Course of Study: ${studentCourse ?? 'Not specified'}

Job Posting:
- Title: ${jobTitle}
- Required Skills: ${jobSkills.length > 0 ? jobSkills.join(', ') : 'None listed'}
- Description: ${jobDescription.substring(0, 300)}

Calculate a match score from 0 to 100 based on:
1. Skills overlap (most important)
2. Course relevance
3. Overall fit

Respond ONLY with a JSON object in this exact format, no other text:
{"score": 75, "reason": "Strong match in React and Node.js skills"}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return {
      score: Math.min(100, Math.max(0, Math.round(parsed.score))),
      reason: parsed.reason ?? 'Based on skills and profile match',
    };
  } catch (error) {
    // Fallback to heuristic if AI fails
    const matchingSkills = studentSkills.filter((s) =>
      jobSkills.some(
        (j) => j.toLowerCase().includes(s.toLowerCase()) ||
               s.toLowerCase().includes(j.toLowerCase()),
      ),
    );
    const score = Math.min(
      95,
      40 + Math.round((matchingSkills.length / Math.max(jobSkills.length, 1)) * 55),
    );
    return { score, reason: 'Based on skills overlap' };
  }
};