export type QuestionType = 'listening' | 'speaking' | 'vocabulary' | 'reading' | 'grammar';

export interface Option {
  id: string;
  text?: string;
  image?: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  audioText?: string;
  audio?: string;
  text?: string;
  passage?: string;
  image?: string;
  options?: Option[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export const testModules: Module[] = [
  {
    id: 'L-1',
    title: '听力筛选',
    description: 'Listen and choose the correct picture',
    questions: [
      {
        id: 'L-1-01',
        type: 'listening',
        audioText: 'dog',
        audio: '/test/M1/dog.wav',
        options: [
          { id: 'a', image: '/test/M1/L-1-01/1.jpg', isCorrect: true },
          { id: 'b', image: '/test/M1/L-1-01/2.jpg', isCorrect: false },
          { id: 'c', image: '/test/M1/L-1-01/3.jpg', isCorrect: false },
          { id: 'd', image: '/test/M1/L-1-01/4.jpg', isCorrect: false },
        ],
      },
      {
        id: 'L-1-02',
        type: 'listening',
        audioText: "It's sunny today.",
        audio: "/test/M1/It's sunny today..wav",
        options: [
          { id: 'a', image: '/test/M1/L-1-02/1.jpg', isCorrect: true },
          { id: 'b', image: '/test/M1/L-1-02/2.jpg', isCorrect: false },
          { id: 'c', image: '/test/M1/L-1-02/3.jpg', isCorrect: false },
          { id: 'd', image: '/test/M1/L-1-02/4.jpg', isCorrect: false },
        ],
      },
      {
        id: 'L-1-03',
        type: 'listening',
        audioText: 'The boy is jumping.',
        audio: '/test/M1/The boy is jumping..wav',
        options: [
          { id: 'a', image: '/test/M1/L-1-03/1.jpg', isCorrect: true },
          { id: 'b', image: '/test/M1/L-1-03/2.jpg', isCorrect: false },
          { id: 'c', image: '/test/M1/L-1-03/3.jpg', isCorrect: false },
          { id: 'd', image: '/test/M1/L-1-03/4.jpg', isCorrect: false },
        ],
      },
      {
        id: 'L-1-04',
        type: 'listening',
        audioText: 'She has a red apple in her hand.',
        audio: '/test/M1/She has a red apple in her hand..wav',
        options: [
          { id: 'a', image: '/test/M1/L-1-04/1.jpg', isCorrect: true },
          { id: 'b', image: '/test/M1/L-1-04/2.jpg', isCorrect: false },
          { id: 'c', image: '/test/M1/L-1-04/3.jpg', isCorrect: false },
          { id: 'd', image: '/test/M1/L-1-04/4.jpg', isCorrect: false },
        ],
      },
      {
        id: 'L-1-05',
        type: 'listening',
        audioText: 'The children are playing in the park after school.',
        audio: '/test/M1/The children are playing in the park after school..wav',
        options: [
          { id: 'a', image: '/test/M1/L-1-05/1.jpg', isCorrect: true },
          { id: 'b', image: '/test/M1/L-1-05/2.jpg', isCorrect: false },
          { id: 'c', image: '/test/M1/L-1-05/3.jpg', isCorrect: false },
          { id: 'd', image: '/test/M1/L-1-05/4.jpg', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'S-1',
    title: '口语跟读',
    description: 'Listen and repeat',
    questions: [
      {
        id: 'S-1-01',
        type: 'speaking',
        audioText: "Hello! I'm Mia.",
        audio: "/test/M2/Hello! I'm Mia..wav",
        text: "Hello! I'm Mia.",
      },
      {
        id: 'S-1-02',
        type: 'speaking',
        audioText: 'I like to play with my cat.',
        audio: '/test/M2/I like to play with my cat..wav',
        text: 'I like to play with my cat.',
      },
      {
        id: 'S-1-03',
        type: 'speaking',
        audioText: 'The sun is shining brightly today.',
        audio: '/test/M2/The sun is shining brightly today..wav',
        text: 'The sun is shining brightly today.',
      },
    ],
  },
  {
    id: 'VA-1',
    title: '词汇',
    description: 'Listen and choose the correct picture',
    questions: [
      {
        id: 'VA-1-01',
        type: 'vocabulary',
        audioText: 'apple',
        audio: '/test/M3/apple.wav',
        options: [
          { id: 'a', image: '/test/M3/wordcard/VA-1-01/apple.png', isCorrect: true },
          { id: 'b', image: '/test/M3/wordcard/VA-1-01/orange.png', isCorrect: false },
          { id: 'c', image: '/test/M3/wordcard/VA-1-01/banana.png', isCorrect: false },
          { id: 'd', image: '/test/M3/wordcard/VA-1-01/grapes.png', isCorrect: false },
        ],
      },
      {
        id: 'VA-1-02',
        type: 'vocabulary',
        audioText: 'dog',
        audio: '/test/M3/dog.wav',
        options: [
          { id: 'a', image: '/test/M3/wordcard/VA-1-02/dog.png', isCorrect: true },
          { id: 'b', image: '/test/M3/wordcard/VA-1-02/cat.png', isCorrect: false },
          { id: 'c', image: '/test/M3/wordcard/VA-1-02/rabbit.png', isCorrect: false },
          { id: 'd', image: '/test/M3/wordcard/VA-1-02/bird.png', isCorrect: false },
        ],
      },
      {
        id: 'VA-1-03',
        type: 'vocabulary',
        audioText: 'red',
        audio: '/test/M3/red.wav',
        options: [
          { id: 'a', image: '/test/M3/wordcard/VA-1-03/red.png', isCorrect: true },
          { id: 'b', image: '/test/M3/wordcard/VA-1-03/blue.png', isCorrect: false },
          { id: 'c', image: '/test/M3/wordcard/VA-1-03/green.png', isCorrect: false },
          { id: 'd', image: '/test/M3/wordcard/VA-1-03/yellow.png', isCorrect: false },
        ],
      },
      {
        id: 'VA-1-04',
        type: 'vocabulary',
        audioText: 'running',
        audio: '/test/M3/running.wav',
        options: [
          { id: 'a', image: '/test/M3/wordcard/VA-1-04/running.png', isCorrect: true },
          { id: 'b', image: '/test/M3/wordcard/VA-1-04/jump.png', isCorrect: false },
          { id: 'c', image: '/test/M3/wordcard/VA-1-04/swim.png', isCorrect: false },
          { id: 'd', image: '/test/M3/wordcard/VA-1-04/sleep.png', isCorrect: false },
        ],
      },
      {
        id: 'VA-1-05',
        type: 'vocabulary',
        audioText: 'big',
        audio: '/test/M3/big.wav',
        options: [
          { id: 'a', image: '/test/M3/wordcard/VA-1-05/big.png', isCorrect: true },
          { id: 'b', image: '/test/M3/wordcard/VA-1-05/mouse.png', isCorrect: false },
          { id: 'c', image: '/test/M3/wordcard/VA-1-05/fox.png', isCorrect: false },
          { id: 'd', image: '/test/M3/wordcard/VA-1-05/father.png', isCorrect: false },
        ],
      },
      {
        id: 'VA-1-06',
        type: 'vocabulary',
        audioText: 'happy',
        audio: '/test/M3/happy.wav',
        options: [
          { id: 'a', image: '/test/M3/wordcard/VA-1-06/confident.png', isCorrect: true },
          { id: 'b', image: '/test/M3/wordcard/VA-1-06/cranky.png', isCorrect: false },
          { id: 'c', image: '/test/M3/wordcard/VA-1-06/nervous.png', isCorrect: false },
          { id: 'd', image: '/test/M3/wordcard/VA-1-06/give_up.png', isCorrect: false },
        ],
      },
      {
        id: 'VA-1-07',
        type: 'vocabulary',
        audioText: 'house',
        audio: '/test/M3/house.wav',
        options: [
          { id: 'a', image: '/test/M3/wordcard/VA-1-07/house.png', isCorrect: true },
          { id: 'b', image: '/test/M3/wordcard/VA-1-07/school.png', isCorrect: false },
          { id: 'c', image: '/test/M3/wordcard/VA-1-07/park.png', isCorrect: false },
          { id: 'd', image: '/test/M3/wordcard/VA-1-07/garden.png', isCorrect: false },
        ],
      },
      {
        id: 'VA-1-08',
        type: 'vocabulary',
        audioText: 'sun',
        audio: '/test/M3/sun.wav',
        options: [
          { id: 'a', image: '/test/M3/wordcard/VA-1-08/sun.png', isCorrect: true },
          { id: 'b', image: '/test/M3/wordcard/VA-1-08/moon.png', isCorrect: false },
          { id: 'c', image: '/test/M3/wordcard/VA-1-08/stars.png', isCorrect: false },
          { id: 'd', image: '/test/M3/wordcard/VA-1-08/earth.png', isCorrect: false },
        ],
      },
      {
        id: 'VA-1-09',
        type: 'vocabulary',
        text: 'library',
        image: '/test/M3/VB-1-05 06 07 08/05.jpg',
        options: [
          { id: 'a', text: 'library', isCorrect: true },
          { id: 'b', text: 'hospital', isCorrect: false },
          { id: 'c', text: 'restaurant', isCorrect: false },
          { id: 'd', text: 'cinema', isCorrect: false },
        ],
      },
      {
        id: 'VA-1-10',
        type: 'vocabulary',
        text: 'dentist',
        image: '/test/M3/VB-1-05 06 07 08/06.jpg',
        options: [
          { id: 'a', text: 'doctor', isCorrect: false },
          { id: 'b', text: 'dentist', isCorrect: true },
          { id: 'c', text: 'nurse', isCorrect: false },
          { id: 'd', text: 'vet', isCorrect: false },
        ],
      },
      {
        id: 'VA-1-11',
        type: 'vocabulary',
        text: 'fire station',
        image: '/test/M3/VB-1-05 06 07 08/07.jpg',
        options: [
          { id: 'a', text: 'police station', isCorrect: false },
          { id: 'b', text: 'fire station', isCorrect: true },
          { id: 'c', text: 'hospital', isCorrect: false },
          { id: 'd', text: 'school', isCorrect: false },
        ],
      },
      {
        id: 'VA-1-12',
        type: 'vocabulary',
        text: 'autumn',
        image: '/test/M3/VB-1-05 06 07 08/08.jpg',
        options: [
          { id: 'a', text: 'spring', isCorrect: false },
          { id: 'b', text: 'summer', isCorrect: false },
          { id: 'c', text: 'autumn', isCorrect: true },
          { id: 'd', text: 'winter', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'R-1',
    title: '阅读理解',
    description: 'Read the passage and answer the questions',
    questions: [
      {
        id: 'R-1-01',
        type: 'reading',
        passage: 'Tom has a pet cat named Mochi. Mochi is small and white with bright green eyes. Every morning, Tom gives Mochi fresh milk and some fish. Mochi loves to sit in the sunshine by the window. When Tom comes home from school, Mochi always runs to the door to meet him. Tom says Mochi is his best friend.',
        text: "What colour are Mochi's eyes?",
        options: [
          { id: 'a', text: 'Blue', isCorrect: false },
          { id: 'b', text: 'Green', isCorrect: true },
          { id: 'c', text: 'Brown', isCorrect: false },
          { id: 'd', text: 'Yellow', isCorrect: false },
        ],
      },
      {
        id: 'R-1-02',
        type: 'reading',
        passage: 'Tom has a pet cat named Mochi. Mochi is small and white with bright green eyes. Every morning, Tom gives Mochi fresh milk and some fish. Mochi loves to sit in the sunshine by the window. When Tom comes home from school, Mochi always runs to the door to meet him. Tom says Mochi is his best friend.',
        text: 'What does Tom give Mochi every morning?',
        options: [
          { id: 'a', text: 'Only milk', isCorrect: false },
          { id: 'b', text: 'Only fish', isCorrect: false },
          { id: 'c', text: 'Milk and fish', isCorrect: true },
          { id: 'd', text: 'Cat food', isCorrect: false },
        ],
      },
      {
        id: 'R-1-03',
        type: 'reading',
        passage: 'Tom has a pet cat named Mochi. Mochi is small and white with bright green eyes. Every morning, Tom gives Mochi fresh milk and some fish. Mochi loves to sit in the sunshine by the window. When Tom comes home from school, Mochi always runs to the door to meet him. Tom says Mochi is his best friend.',
        text: 'Why does Mochi like to sit by the window?',
        options: [
          { id: 'a', text: 'To wait for Tom', isCorrect: false },
          { id: 'b', text: 'To sit in the sunshine', isCorrect: true },
          { id: 'c', text: 'To watch birds outside', isCorrect: false },
          { id: 'd', text: 'To sleep', isCorrect: false },
        ],
      },
      {
        id: 'R-1-04',
        type: 'reading',
        passage: 'Tom has a pet cat named Mochi. Mochi is small and white with bright green eyes. Every morning, Tom gives Mochi fresh milk and some fish. Mochi loves to sit in the sunshine by the window. When Tom comes home from school, Mochi always runs to the door to meet him. Tom says Mochi is his best friend.',
        text: "Which sentence best describes Tom and Mochi's relationship?",
        options: [
          { id: 'a', text: 'Tom finds Mochi annoying.', isCorrect: false },
          { id: 'b', text: 'They are best friends.', isCorrect: true },
          { id: 'c', text: 'Tom rarely spends time with Mochi.', isCorrect: false },
          { id: 'd', text: 'Mochi does not like Tom.', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'G-1',
    title: '语法筛选',
    description: 'Choose the correct word to fill in the blank',
    questions: [
      {
        id: 'G-1-01',
        type: 'grammar',
        text: 'She _____ to school every day by bus.',
        options: [
          { id: 'a', text: 'go', isCorrect: false },
          { id: 'b', text: 'goes', isCorrect: true },
          { id: 'c', text: 'going', isCorrect: false },
          { id: 'd', text: 'gone', isCorrect: false },
        ],
      },
      {
        id: 'G-1-02',
        type: 'grammar',
        text: 'By the time we arrived, the movie _____ already started.',
        options: [
          { id: 'a', text: 'has', isCorrect: false },
          { id: 'b', text: 'had', isCorrect: true },
          { id: 'c', text: 'have', isCorrect: false },
          { id: 'd', text: 'was', isCorrect: false },
        ],
      },
      {
        id: 'G-1-03',
        type: 'grammar',
        text: 'She suggested _____ to the museum on Saturday.',
        options: [
          { id: 'a', text: 'to go', isCorrect: false },
          { id: 'b', text: 'going', isCorrect: true },
          { id: 'c', text: 'go', isCorrect: false },
          { id: 'd', text: 'went', isCorrect: false },
        ],
      },
    ],
  },
];
