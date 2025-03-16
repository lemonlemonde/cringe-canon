notes.md

## system prompt:
```
You are given a drawing of an Original character (OC). Bulletpoint identify things you see in the drawing that are relevant to making a character profile.
```
```
Given a description and a list of features about an original character (OC) based on a drawing, produce a character profile (name, pronouns, occupation, education, personality, style, MBTI, hobbies, likes, dislikes, current concerns, quote) in bulletpoints. Also give a paragraph backstory with worldbuilding based on the features. Format it with '## PROFILE' and '## BACKGROUND'. Be confident.
```
## example user input:
```
Ai.A, pronounced "Aiyah", is a bioengineered human living in a world full of demons. She likes long walks on the beach at noon because the sunset reminds her of the orange glow of her incubator, where she was born.
```
```
Their full name is Nicolas Nomed, but they go by Nicola, because they're a big fan of Nikolas Tesla, despite not like mechanical things, since they're best at magic. Their favorite color is actually green, but they're forced to wear black and purple for the vibes of a villain. On their off-time, they'll usually be seen painting big green paintings, to supplement for their lack of exposure to green during their work hours.
```

## example system output:
1. From VLM

```
- Name: Nicolas Nomad
- Species: Demonio Lujurioso (Lustful Demon)
- Appearance:
  - Dark purple and black color scheme
  - Long, flowing hair
  - Sharp, pointed ears
  - White gloves with black claws
  - Purple and white boots with high heels
  - Purple and black outfit with a high collar
  - A necklace with a green pendant
  - A purple gem on the forehead
- Features:
  - Scars on the back, which are hidden by his power
  - Sharp teeth
  - Pointed wings with a golden tip
- Expression:
  - Smiling, confident demeanor
- Additional:
  - The character is modeled after a Mobian
```


2. Then add user description, and give both to LLM
```
Their full name is Nicolas Nomed, but they go by Nicola, because they're a big fan of Nikolas Tesla, despite not like mechanical things, since they're best at magic. Their favorite color is actually green, but they're forced to wear black and purple for the vibes of a villain. On their off-time, they'll usually be seen painting big green paintings, to supplement for their lack of exposure to green during their work hours.
```

3. Send to LLM

### Mixtral-8x22B-Instruct-v0.1

```
## PROFILE

- **Name**: Nicola Nomed
- **Pronouns**: They/Them
- **Occupation**: Arcane Artist
- **Education**: Magus Academy, specializing in Enchanting Arts
- **Personality**: Creative, Introspective, Nonconformist, Aloof at times
- **Style**: Dark with a pop of green; prefers flowing, ethereal fabrics
- **MBTI**: INFP (Idealist, Inventive, Philosophical, Private)
- **Hobbies**: Painting vibrant green landscapes, studying ancient magic, fashion design
- **Likes**: Colorful art, solitude, mysterious artifacts
- **Dislikes**: Restrictive attire, mundane tasks, being underestimated
- **Current Concerns**: Balancing magical duties with their artistic pursuits, expressing individuality in a rigid environment
- **Quote**: "In every shadow lies a shade of green waiting to be painted."

## BACKGROUND

Nicola Nomed hails from a lineage of Demonio Lujuriosos, a species known for their enchanting allure and mastery over the arcane. Born into a world where magic is both a gift and a burden, Nicola quickly distinguished themselves from their kin with a preference for enchanting arts over mechanical endeavors. Inspired by the legendary inventor Nikolas Tesla, Nicola's curiosity for the magical intricacies of the universe set them apart, even as they navigated the expectations of their demon heritage.

Their appearance, a blend of dark purple and black accented with striking green, reflects their inner conflict and desire for self-expression. Despite being compelled to adhere to the villainous aesthetics of their family's legacy, Nicola's heart yearns for the vibrant hues of nature, particularly green, which they infuse into their art. During their off-hours, Nicola retreats to their secluded studio, where they create expansive green canvases, a stark contrast to their day-to-day attire.

Raised in the mystical city of Lunarfall, Nicola attended the prestigious Magus Academy, where they honed their skills in enchanting arts. The academy's emphasis on creativity and innovation allowed Nicola to explore their unique talents, though they often felt constrained by the rigid traditions of their family. The scars on their back, hidden by their magical prowess, serve as a reminder of their struggles and resilience.

Nicola's journey is one of self-discovery and artistic liberation. They strive to carve out a space where their magical duties and artistic passions coexist harmoniously. In a world that often views them through the lens of their demonic heritage, Nicola remains committed to expressing their true self, one vibrant brushstroke at a time.
```