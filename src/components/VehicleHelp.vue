<script setup>
import NaviBar from "./NaviBar.vue";
import MarkdownIt from 'markdown-it';
import { useRoute } from "vue-router";
import { getResponse } from "../genai.js";
import { getVehicles } from "../vehicles.js";
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import mermaid from 'mermaid/dist/mermaid.esm.min.mjs';

// Initialize mermaid only when component is mounted
const initializeMermaid = () => {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    flowchart: {
      htmlLabels: true,
      curve: 'basis'
    },
    themeVariables: {
      fontFamily: 'Arial'
    }
  });
};

// Get query params
const route = useRoute();
const details = route.query || {};

// Get vehicle data
const vehicle = details;
const issues = details.issues || "No issues provided";

// Status variables
const aiOutput = ref('');
const questions = ref([]);
const userAnswers = ref({});
const loading = ref(false);
const error = ref(null);
const step = ref('questions'); // 'questions' or 'flowchart'
const flowchartSvg = ref('');

// Helper to return a displayable value or a default placeholder
const formatField = (val, placeholder = "None") => {
  if (val === undefined || val === null) return placeholder;
  if (typeof val === "string") {
    return val.trim() === "" ? placeholder : val;
  }
  if (typeof val === "number") return isNaN(val) ? placeholder : String(val);
  return String(val);
};

// Helper to get feedback from the AI
const getFeedback = async () => {
  loading.value = true;
  error.value = null;

  try {
    if (step.value === 'questions') {
      // Get the multiple choice questions
      const resp = await getResponse(generateQuestionsPrompt());
      try {
        // Log the response for debugging
        console.log('AI Response:', resp);
        
        // Try to clean the response if it contains markdown backticks
        const jsonStr = resp.replace(/```json\n?|\n?```/g, '').trim();
        console.log('Cleaned JSON:', jsonStr);
        
        const data = JSON.parse(jsonStr);
        if (!data.questions || !Array.isArray(data.questions)) {
          throw new Error('Invalid response format: missing questions array');
        }
        questions.value = data.questions;
      } catch (parseErr) {
        console.error('Parse error:', parseErr);
        throw new Error(`Failed to parse AI response as JSON. Error: ${parseErr.message}`);
      }
    } else {
      // Get the flowchart
      const resp = await getResponse(generateFlowchartPrompt());
      console.log('Flowchart response:', resp);
      
      // Extract the Mermaid diagram from the response
      const mermaidMatch = resp.match(/```mermaid\n([\s\S]*?)\n```/);
      if (mermaidMatch) {
        let mermaidCode = mermaidMatch[1].trim();
        console.log('Original Mermaid code:', mermaidCode);
        
        // First, ensure we have the header on its own line
        mermaidCode = mermaidCode.replace(/^graph TD\s+/, 'graph TD\n');
        
        // Split the code into lines and process each line
        const lines = mermaidCode.split('\n');
        const processedLines = lines.map(line => {
          // Skip the header line
          if (line.trim() === 'graph TD') return line;
          
          // Remove special characters and clean up the line
          return line
            .replace(/\(e\.g\.,?\s[^)]*\)/g, '')  // Remove e.g. examples
            .replace(/[()]/g, '')  // Remove regular parentheses except for start/end nodes
            .replace(/[^a-zA-Z0-9\s{}>|\[\]"-_]/g, '')  // Remove other special characters
            .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
            .trim();
        });
        
        // Reconstruct the Mermaid code with proper formatting
        mermaidCode = processedLines
          .filter(line => line.trim())  // Remove empty lines
          .join('\n    ');  // Add proper indentation
        
        // Ensure proper spacing for the first node definition
        mermaidCode = mermaidCode.replace(/^(graph TD)\s*([A-Z])/, '$1\n    $2');
        
        console.log('Sanitized Mermaid code:', mermaidCode);
        
        // Basic syntax validation
        if (!mermaidCode.startsWith('graph TD') && !mermaidCode.startsWith('flowchart TD')) {
          throw new Error('Invalid flowchart format: Must start with "graph TD" or "flowchart TD"');
        }
        
        try {
          // Validate the diagram first
          await mermaid.parse(mermaidCode);
          
          // If validation passes, render the diagram
          const { svg } = await mermaid.render('diagnostic-flowchart', mermaidCode);
          flowchartSvg.value = svg;
        } catch (mermaidErr) {
          console.error('Mermaid error:', mermaidErr);
          throw new Error(`Failed to render flowchart diagram: ${mermaidErr.message}`);
        }
      } else {
        throw new Error('Invalid flowchart format: Mermaid code block not found');
      }
    }
  } catch (err) {
    error.value = err?.message || String(err);
  } finally {
    loading.value = false;
  }
};

const generateQuestionsPrompt = () => `You are a vehicle diagnostic expert. Based on the following vehicle information and issue description, generate 3-5 multiple choice questions that would help clarify the problem.

IMPORTANT: Your response must be a valid JSON object with this exact structure. Do not include any other text, markdown, or explanations:
{
  "questions": [
    {
      "id": "q1",
      "text": "What is the exact question?",
      "options": [
        { "id": "a", "text": "First option" },
        { "id": "b", "text": "Second option" },
        { "id": "c", "text": "Third option" }
      ]
    }
  ]
}

Vehicle Information:
Year: ${formatField(vehicle.year)}
Make: ${formatField(vehicle.make)}
Model: ${formatField(vehicle.model)}
Trim: ${formatField(vehicle.trim)}
Issues: ${formatField(issues)}

Remember: Return ONLY the JSON object, no other text or formatting.`;

const generateFlowchartPrompt = () => `You are a vehicle diagnostic expert. Create a troubleshooting flowchart using Mermaid diagram syntax based on the following information. The flowchart should guide a mechanic through the diagnostic process.

IMPORTANT: Follow these Mermaid syntax rules exactly:
1. Start with "graph TD" (top-down graph)
2. Each node must have a unique ID using single letters (A, B, C, etc.)
3. Use these node types with simple text (no special characters or parentheses):
   - [Simple Action Text] for process nodes
   - {Simple Question Text} for decision nodes
   - ([Start]) or ([End]) for terminal nodes
4. Connect nodes with arrows using -->
5. Label decision paths using only |Yes| or |No| between arrows
6. Keep node text short and simple
7. Do not use parentheses, special characters, or technical part numbers in node text
8. Each line should follow this format:
   NodeID[Simple Text] --> NodeID2{Simple Question}
   NodeID2 -->|Yes| NodeID3[Next Step]
   NodeID2 -->|No| NodeID4[Alternative Step]

Vehicle Information:
Year: ${formatField(vehicle.year)}
Make: ${formatField(vehicle.make)}
Model: ${formatField(vehicle.model)}
Trim: ${formatField(vehicle.trim)}
Issues: ${formatField(issues)}

User Responses:
${Object.entries(userAnswers.value)
  .map(([questionId, answer]) => {
    const question = questions.value.find(q => q.id === questionId);
    const option = question?.options.find(opt => opt.id === answer);
    return `${question?.text}: ${option?.text}`;
  })
  .join('\n')}

Your response must be a valid Mermaid flowchart code block following this EXACT format:

\`\`\`mermaid
graph TD
    A([Start]) --> B{Check Issue}
    B -->|Yes| C[Next Step]
    B -->|No| D[Alternative]
\`\`\`

CRITICAL FORMATTING RULES:
1. "graph TD" must be on its own line
2. Each node definition and connection must be on a new line
3. Each line (except "graph TD") must start with 4 spaces
4. No blank lines between nodes
5. Each node connection must be a complete statement (e.g., "A --> B")
6. Use consistent indentation
7. No extra spaces in node definitions

Return ONLY the mermaid code block with your diagnostic flowchart, no other text or explanations.`;

// Handle user's answer selection
const handleAnswer = (questionId, answerId) => {
  userAnswers.value[questionId] = answerId;
};

// Check if all questions are answered
const canProceed = computed(() => {
  return questions.value.every(q => userAnswers.value[q.id]);
});

// Proceed to flowchart generation
const proceedToFlowchart = () => {  
  if (canProceed.value) {
    step.value = 'flowchart';
    getFeedback();
  }
};

// Reset answers and go back to questions
const resetToQuestions = () => {
  userAnswers.value = {};
  step.value = 'questions';
  getFeedback();
};

onMounted(() => {
  // Initialize mermaid when component is mounted
  initializeMermaid();
  // Fire the AI request when the page loads
  getFeedback();
});

// Cleanup when component is unmounted
onBeforeUnmount(() => {
  // Clear any Mermaid diagrams and reset state
  flowchartSvg.value = '';
  mermaid.initialize({ startOnLoad: false });
});
</script>

<template>
  <div class="untree_co-section" id="features-section">
    <div class="container">
      <div style="max-width:800px;margin:20px auto;">
        <h2>Vehicle Help</h2>
        <p><strong>Vehicle:</strong> {{ vehicle.make || 'Unknown' }} {{ vehicle.model || '' }} ({{ vehicle.year || '' }})</p>
        <p><strong>Issues submitted:</strong> {{ issues }}</p>
        
        <div style="margin-top:1rem;">
          <!-- Show a loading indicator -->
          <div v-if="loading" class="loading">Loading...</div>

          <div v-else-if="error" class="error">Error: {{ error }}</div>

          <div v-else>
            <!-- Questions Section -->
            <div v-if="step === 'questions'" class="questions-section">
              <h3>Please Answer These Questions</h3>
              <div v-for="question in questions" :key="question.id" class="question-card">
                <p class="question-text">{{ question.text }}</p>
                <div class="options">
                  <div v-for="option in question.options" :key="option.id" 
                       class="option" 
                       :class="{ selected: userAnswers[question.id] === option.id }"
                       @click="handleAnswer(question.id, option.id)">
                    {{ option.text }}
                  </div>
                </div>
              </div>
              <button 
                @click="proceedToFlowchart" 
                :disabled="!canProceed"
                class="btn btn-primary mt-4">
                Generate Diagnostic Flowchart
              </button>
            </div>

            <!-- Flowchart Section -->
            <div v-else class="flowchart-section">
              <h3>Diagnostic Flowchart</h3>
              <div v-if="flowchartSvg" v-html="flowchartSvg" class="flowchart-container"></div>
              <div v-else class="loading">Generating flowchart...</div>
              <button 
                @click="resetToQuestions" 
                class="btn btn-secondary mt-4">
                Back to Questions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: white;
}

.question-text {
  font-weight: 600;
  margin-bottom: 15px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option:hover {
  background-color: #f5f5f5;
}

.option.selected {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.flowchart-container {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  overflow-x: auto;
}

.loading {
  text-align: center;
  padding: 20px;
  font-style: italic;
}

.error {
  color: #dc3545;
  padding: 10px;
  border: 1px solid #dc3545;
  border-radius: 4px;
  margin-top: 10px;
}
</style>