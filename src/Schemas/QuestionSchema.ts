import * as yup from 'yup';
const questionSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .min(10, 'Title should be at least 10 characters long.')
    .max(200, 'Title should be at most 100 characters long.')
    .required('Title is required.')
    .test('no-spam', 'Title contains spam words', value => {
      const spamWords = [
        'viagra',
        'cialis',
        'make money fast',
        'earn extra cash',
        'work from home',
      ];
      return !spamWords.some(word => value?.toLowerCase().includes(word));
    })
    .test('no-profanity', 'Title contains profanity', value => {
      const profanityRegex =
        /\b(fuck|shit|damn|bitch|ass|crap|hell|bastard|pussy|dick|cock|piss|slut|whore)\b/i;
      return !profanityRegex.test(value ?? '');
    })
    // .test('meaningful-words', 'Title should contain meaningful words', (value) => {
    //     const words = value?.split(/\s+/) ?? [];
    //     const meaningfulWords = words.filter(word => dictionaryCheck(word)); // You'd need to implement dictionaryCheck
    //     return meaningfulWords.length >= 3; // Require at least 3 meaningful words
    //   })
    .test('no-repeating-chars', 'Title should not have too many repeating characters', value => {
      return !/(.)\1{3,}/.test(value ?? ''); // No more than 3 consecutive repeating characters
    })
    .test('minimum-words', 'Title should have at least 5 words', value => {
      const words = value?.split(/\s+/) ?? [];
      return words.length >= 5;
    }),

  content: yup
    .string()
    .trim()
    .max(10000, 'Content should be at most 10,000 characters long.')
    .required('Content is required.')
    .test('no-spam', 'Content contains spam words', value => {
      const spamWords = [
        'viagra',
        'cialis',
        'make money fast',
        'earn extra cash',
        'work from home',
      ];
      return !spamWords.some(word => value?.toLowerCase().includes(word));
    })
    .test('no-profanity', 'Content contains profanity', value => {
      const profanityRegex =
        /\b(fuck|shit|damn|bitch|ass|crap|hell|bastard|pussy|dick|cock|piss|slut|whore)\b/i;
      return !profanityRegex.test(value ?? '');
    }),

  tags: yup
    .array()
    .of(
      yup
        .string()
        .trim()
        .min(2, 'Tag should be at least 2 characters long.')
        .max(20, 'Tag should be at most 20 characters long.')
        .test('no-spam', 'Tag contains spam words', value => {
          const spamWords = [
            'viagra',
            'cialis',
            'make money fast',
            'earn extra cash',
            'work from home',
          ];
          return !spamWords.some(word => value?.toLowerCase().includes(word));
        })
    )
    .min(1, 'Please add at least one tag.')
    .max(5, 'You can only add up to 5 tags.')
    .required('Tags are required.')
    .test('unique-tags', 'Tags must be unique', value =>
      value ? new Set(value).size === value.length : true
    ),
});

export default questionSchema;
