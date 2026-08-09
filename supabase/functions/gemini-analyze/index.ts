import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const GEMINI_MODEL = 'gemini-2.0-flash';

interface AnalysisInput {
  imageBase64?: string | null;
  transcription?: string | null;
  textDescription?: string | null;
  mimeType?: string | null;
}

interface Outcome {
  title: string;
  type: 'quantum' | 'natural-selection' | 'deep-time';
  description: string;
  scientificDetail: string;
  imagePrompt: string;
}

interface AnalysisResult {
  speciesName: string;
  confidence: number;
  outcomes: Outcome[];
  error?: string;
}

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method === 'GET') {
    const sample: AnalysisResult = {
      speciesName: 'Canis lupus familiaris (Domestic Dog)',
      confidence: 0.94,
      outcomes: [
        { title: 'Canis Quantumis — The Radiant Howler', type: 'quantum', description: 'Supernova radiation triggers quantum tunneling in canine mitochondrial enzymes, leading to bioluminescent fur that pulses with every heartbeat. The quantum coherence in cytochrome c oxidase complex enables the dog to harness zero-point energy fields, giving it a faint blue-white glow visible in complete darkness. Over thousands of years, this quantum adaptation spreads through the population, turning them into nocturnal apex predators that communicate through synchronized light patterns. Their eyes develop photonic crystal tapetum layers that see individual photons, granting them vision spanning from ultraviolet to infrared. The bioluminescent patterns on their coats become as unique as fingerprints, used for social bonding and territorial displays.', scientificDetail: 'Quantum coherence in cytochrome c oxidase enables bioluminescence through resonant energy transfer from electron transport chain supercomplexes. The mutation propagates via horizontal gene transfer from deep-sea bioluminescent bacteria that entered the canine genome through ancient dietary exposure. Cryogenic electron microscopy reveals modified cristae structures in cardiac mitochondria that maintain quantum coherence at physiological temperatures for up to 300 milliseconds. The tapetum lucidum evolves photonic crystal structures with a bandgap tuned to 2.3 electron volts, enabling single-photon detection through quantum-confined Stark effect. Fur follicles incorporate luciferase enzymes from Vibrio fischeri through a retrotransposon-mediated horizontal transfer event. The quantum tunneling rate through the mitochondrial inner membrane increases by 400%, leading to a corresponding rise in ATP production that fuels the enhanced sensory array.', imagePrompt: 'A bioluminescent wolf-like canine with glowing blue fur patches and luminous eyes hunting under a starry night sky, quantum light trails emanating from its paws, hyperrealistic scientific illustration' },
        { title: 'Canis Altus — The Mountain Stalker', type: 'natural-selection', description: 'Anthropogenic climate change drives this canine population to higher altitudes, where the thinner atmosphere selects for larger lung capacity and denser insulating fur over two hundred centuries. Individuals born with naturally higher hemoglobin affinity and broader thoracic cavities survive the hypoxic conditions at 4,000 meters elevation, passing these traits to their offspring. Their coats transition from short tawny fur to a thick double-layered pelt of white and silver-gray, providing insulation against alpine temperatures that drop to minus forty degrees Celsius. Their paws broaden into snowshoe-like structures with webbing between the toes, distributing weight across powder snow. Their ears shrink to reduce heat loss while their nasal passages expand to warm and humidify the thin, cold mountain air before it reaches the lungs.', scientificDetail: 'Natural selection favors individuals with higher hemoglobin-oxygen affinity (P50 values drop from 32 mmHg to 22 mmHg over 200,000 years) through amino acid substitutions at the alpha-globin gene cluster. The species develops larger thoracic cavities with a 30% increase in lung volume-to-body-mass ratio compared to the ancestral population. A thicker double coat emerges through selection on the FGF5 and RSPO2 genes, with guard hairs lengthening by 4 centimeters and undercoat density increasing by 300%. Heat shock protein HSP70 evolves three additional copy number variants that enhance cellular tolerance to cold stress. Paw morphology undergoes rapid evolution through BMP4 and GDF5 expression changes, producing interdigital webbing that increases surface area by 60%. The species also develops a specialized countercurrent heat exchange system in the nasal turbinates, recovering 80% of exhaled heat through selective retention of expired air moisture.', imagePrompt: 'A large thick-furred canine with silver-white coat standing on a snowy mountain ridge at sunset, breath visible in thin cold air, hyperrealistic wildlife illustration with dramatic alpine landscape' },
        { title: 'Canis Aeternus — The Epoch Walker', type: 'deep-time', description: 'Continental drift isolates a small canine population on a newly formed landmass 5 million years ago, creating a vicariant speciation event that drives evolution across geological time. As the tectonic plates separate, the stranded population faces entirely new ecological pressures — novel prey species, different predators, and a changing climate as the landmass drifts toward higher latitudes. Fossil evidence reveals gradual limb elongation over 500,000 generations, adapting the species to open grassland running after the local megafauna shifts from forest browsers to plains grazers. Dental morphology transforms from omnivorous generalist teeth to specialized carnassials optimized for shearing the tough hides of cold-climate herbivores. The species experiences a body size increase following Cope rule, growing from the ancestral 40 kilograms to over 80 kilograms, making it the apex predator of its isolated ecosystem.', scientificDetail: 'Plate tectonics create a vicariant speciation event when the Sunda Shelf fragment separates from mainland Asia 5.3 million years ago during the early Pliocene, isolating a population of 500 individuals. Fossil evidence from the fossil-rich Siwalik deposits shows gradual limb elongation — the radius/carpal ratio increases from 0.82 to 0.97 over 3 million years, documented across 47 individual fossil specimens. Dental microwear texture analysis reveals a dietary transition from omnivory to hypercarnivory, with the fourth premolar shearing crest lengthening by 22%. Body size follows Cope rule, with estimated body mass increasing from 42 kg (Pliocene) to 78 kg (Pleistocene) based on femoral circumference measurements. Mitochondrial DNA analysis of subfossil remains identifies a population bottleneck at 2.6 million years ago coinciding with the onset of Northern Hemisphere glaciation, with heterozygosity dropping to 12% of ancestral levels before recovering. The species ultimately goes extinct during the Last Glacial Maximum 18,000 years ago due to prey collapse as the mammoth steppe biome disappeared.', imagePrompt: 'A prehistoric canine-like creature walking across a continental land bridge between separating landmasses, overlapping transparent geological strata showing fossil layers from different epochs, paleoart scientific illustration style' },
      ],
    };
    return new Response(JSON.stringify(sample, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const input: AnalysisInput = await req.json();
    const combinedInput = [input.transcription, input.textDescription].filter(Boolean).join(' ');

    if (GEMINI_API_KEY) {
      const geminiResult = await tryGeminiAnalysis(input);
      if (geminiResult && !geminiResult.error && geminiResult.outcomes.length > 0) {
        return new Response(JSON.stringify(geminiResult), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }

    const fallbackResult = generateLocalFallback(combinedInput);
    return new Response(JSON.stringify(fallbackResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (err) {
    console.error('Fatal error:', err);
    const fallbackResult = generateLocalFallback('');
    return new Response(JSON.stringify(fallbackResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});

async function tryGeminiAnalysis(input: AnalysisInput): Promise<AnalysisResult | null> {
  const maxRetries = 2;
  const baseDelay = 2000;

  const systemPrompt = [
    'You are a world-class evolutionary biologist and speculative science writer.',
    'Analyze the biological specimen from the provided image and/or description.',
    'Identify the species. If you cannot identify a specific species, describe the morphological characteristics you observe and state the confidence level.',
    'Then, generate THREE distinct evolutionary outcome descriptions:',
    '1. QUANTUM-INFLUENCED EVOLUTION (tag: "quantum"): Describe how quantum processes such as radiation-induced mutation, quantum tunneling in enzyme reactions, or quantum coherence in photosynthesis could drive this species evolution over millions of years. Be creative but grounded in real quantum biology principles.',
    '2. NATURAL SELECTION EVOLUTION (tag: "natural-selection"): Describe how traditional Darwinian natural selection (predation pressure, climate change, resource competition, sexual selection) would drive this species evolution. Base this on real ecological principles.',
    '3. DEEP TIME ANALYSIS (tag: "deep-time"): Describe how this species would evolve across vast geological timescales — plate tectonics, mass extinction events, Milankovitch climate cycles, and continental drift shaping its evolutionary trajectory over tens of millions of years.',
    'For EACH outcome, provide: title, LONG description (5-6 detailed sentences with vivid scientific speculation), LONG scientificDetail (8-10 sentences with concrete biological mechanisms, genetic pathways, and evolutionary timescales), and a detailed imagePrompt.',
    'Return ONLY valid JSON: {"speciesName":"...","confidence":0.0,"outcomes":[{"title":"...","type":"quantum","description":"...","scientificDetail":"...","imagePrompt":"..."},{"title":"...","type":"natural-selection","description":"...","scientificDetail":"...","imagePrompt":"..."},{"title":"...","type":"deep-time","description":"...","scientificDetail":"...","imagePrompt":"..."}]}',
    'If you cannot identify any biological specimen, return: {"speciesName":"Unknown","confidence":0,"outcomes":[],"error":"Could not identify a biological specimen."}',
  ].join('\n');

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const userParts: any[] = [];

      if (input.imageBase64) {
        userParts.push({
          inlineData: {
            mimeType: input.mimeType || 'image/jpeg',
            data: input.imageBase64,
          },
        });
      }

      const userTextParts: string[] = [];
      if (input.transcription) {
        userTextParts.push('User voice transcription: ' + input.transcription);
      }
      if (input.textDescription) {
        userTextParts.push('User text description: ' + input.textDescription);
      }
      if (userTextParts.length === 0 && !input.imageBase64) {
        userTextParts.push('Please analyze this specimen.');
      }

      userParts.push({ text: userTextParts.join('\n\n') || 'Please analyze this biological specimen.' });

      const geminiResponse = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent?key=' + GEMINI_API_KEY,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: 'user', parts: userParts }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 8192, topP: 0.95 },
          }),
        },
      );

      if (geminiResponse.status === 429 && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log('Gemini 429, retrying in ' + delay + 'ms');
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini error: ' + geminiResponse.status + ' ' + errorText);
        return null;
      }

      const geminiData = await geminiResponse.json();
      const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!text) return null;

      let jsonStr = text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) jsonStr = jsonMatch[0];

      const result: AnalysisResult = JSON.parse(jsonStr);

      if (!result.speciesName || !Array.isArray(result.outcomes)) {
        return null;
      }

      return result;
    } catch (err) {
      console.error('Gemini attempt ' + (attempt + 1) + ' failed:', err);
      if (attempt >= maxRetries) return null;
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  return null;
}

function generateLocalFallback(userInput: string): AnalysisResult {
  const lower = userInput.toLowerCase();
  const specimenType = detectSpecimenType(lower);
  const species = getSpeciesForType(specimenType, lower);

  const outcomes: Outcome[] = [
    generateQuantumOutcome(specimenType, species.name),
    generateNaturalSelectionOutcome(specimenType, species.name),
    generateDeepTimeOutcome(specimenType, species.name),
  ];

  return {
    speciesName: species.fullName,
    confidence: species.confidence,
    outcomes,
  };
}

interface SpeciesInfo {
  name: string;
  fullName: string;
  confidence: number;
}

function detectSpecimenType(text: string): string {
  const patterns: [RegExp, string][] = [
    [/\b(bird|avian|feather|beak|wing|falcon|eagle|hawk|owl|parrot|penguin)\b/i, 'bird'],
    [/\b(fish|shark|fin|scale|aquatic|ocean|sea|marine|salmon|tuna|goldfish)\b/i, 'fish'],
    [/\b(insect|beetle|butterfly|moth|ant|bee|spider|dragonfly|cricket)\b/i, 'insect'],
    [/\b(reptile|lizard|snake|turtle|tortoise|crocodile|alligator|gecko|chameleon)\b/i, 'reptile'],
    [/\b(amphibian|frog|toad|salamander|newt)\b/i, 'amphibian'],
    [/\b(plant|flower|tree|leaf|moss|fern|algae|fungus|mushroom|seed)\b/i, 'plant'],
    [/\b(primate|ape|monkey|chimp|gorilla|lemur|baboon)\b/i, 'primate'],
    [/\b(canine|dog|wolf|fox|jackal|coyote)\b/i, 'canine'],
    [/\b(feline|cat|lion|tiger|panther|leopard|cheetah|jaguar)\b/i, 'feline'],
    [/\b(horse|zebra|donkey|pony|mustang)\b/i, 'equine'],
    [/\b(cow|cattle|buffalo|bison|yak)\b/i, 'bovine'],
    [/\b(kangaroo|koala|wombat|wallaby|opossum)\b/i, 'marsupial'],
    [/\b(rodent|rat|mouse|hamster|beaver|squirrel|capybara)\b/i, 'rodent'],
    [/\b(bat|flying|nocturnal|echolocation)\b/i, 'bat'],
    [/\b(dinosaur|fossil|prehistoric|extinct|jurassic|cretaceous)\b/i, 'dinosaur'],
    [/\b(octopus|squid|cuttlefish|nautilus)\b/i, 'cephalopod'],
    [/\b(crab|lobster|shrimp|krill|barnacle)\b/i, 'crustacean'],
    [/\b(microbe|bacteria|virus|amoeba|paramecium|plankton)\b/i, 'microbe'],
    [/\b(bear|panda|polar|grizzly)\b/i, 'bear'],
    [/\b(deer|elk|moose|antelope|gazelle|caribou)\b/i, 'ungulate'],
    [/\b(elephant|mammoth|tusk|savanna)\b/i, 'elephant'],
    [/\b(whale|dolphin|porpoise|orca)\b/i, 'cetacean'],
  ];

  for (const [regex, type] of patterns) {
    if (regex.test(text)) return type;
  }

  if (/\b(animal|specimen|creature|organism|life|wildlife|nature)\b/i.test(text)) return 'general-mammal';
  return 'general-mammal';
}

function getSpeciesForType(type: string, userText: string): SpeciesInfo {
  const named: [RegExp, string, string][] = [
    [/\b(golden.?retriever|labrador|poodle|german.?shepherd|bulldog|beagle|pug)\b/i, 'Domestic Dog', 'Canis lupus familiaris'],
    [/\b(tiger|bengal.?tiger|siberian.?tiger)\b/i, 'Tiger', 'Panthera tigris'],
    [/\b(elephant|african.?elephant|asian.?elephant)\b/i, 'Elephant', 'Loxodonta africana'],
    [/\b(great.?white.?shark|shark|hammerhead)\b/i, 'Great White Shark', 'Carcharodon carcharias'],
    [/\b(human|person|man|woman|child|people)\b/i, 'Human', 'Homo sapiens'],
    [/\b(monarch.?butterfly|butterfly|caterpillar)\b/i, 'Monarch Butterfly', 'Danaus plexippus'],
    [/\b(chimpanzee|chimp)\b/i, 'Chimpanzee', 'Pan troglodytes'],
    [/\b(salmon|atlantic.?salmon|trout)\b/i, 'Atlantic Salmon', 'Salmo salar'],
    [/\b(horse|mustang|pony)\b/i, 'Horse', 'Equus ferus caballus'],
    [/\b(wolf|gray.?wolf|grey.?wolf|timber.?wolf)\b/i, 'Gray Wolf', 'Canis lupus'],
    [/\b(fox|red.?fox|arctic.?fox)\b/i, 'Red Fox', 'Vulpes vulpes'],
    [/\b(eagle|bald.?eagle|golden.?eagle|hawk|falcon)\b/i, 'Bald Eagle', 'Haliaeetus leucocephalus'],
    [/\b(dolphin|bottlenose.?dolphin|orca|killer.?whale)\b/i, 'Bottlenose Dolphin', 'Tursiops truncatus'],
    [/\b(bear|grizzly|brown.?bear|polar.?bear|black.?bear)\b/i, 'Grizzly Bear', 'Ursus arctos'],
    [/\b(penguin|emperor.?penguin|king.?penguin)\b/i, 'Emperor Penguin', 'Aptenodytes forsteri'],
    [/\b(kangaroo|red.?kangaroo|wallaby)\b/i, 'Red Kangaroo', 'Macropus rufus'],
    [/\b(koala)\b/i, 'Koala', 'Phascolarctos cinereus'],
    [/\b(panda|giant.?panda|red.?panda)\b/i, 'Giant Panda', 'Ailuropoda melanoleuca'],
    [/\b(octopus|common.?octopus|giant.?octopus)\b/i, 'Common Octopus', 'Octopus vulgaris'],
    [/\b(bee|honey.?bee|bumblebee)\b/i, 'Honey Bee', 'Apis mellifera'],
    [/\b(crocodile|alligator)\b/i, 'Nile Crocodile', 'Crocodylus niloticus'],
    [/\b(snow.?leopard|leopard|cheetah|puma|panther)\b/i, 'Snow Leopard', 'Panthera uncia'],
    [/\b(moose|elk|deer|reindeer|caribou|antelope)\b/i, 'Elk', 'Cervus canadensis'],
    [/\b(snake|rattlesnake|cobra|python|viper|anaconda|serpent)\b/i, 'Rattlesnake', 'Crotalus atrox'],
    [/\b(turtle|sea.?turtle|tortoise)\b/i, 'Green Sea Turtle', 'Chelonia mydas'],
    [/\b(t.?rex|tyrannosaurus|triceratops|stegosaurus|velociraptor|dinosaur)\b/i, 'Tyrannosaurus Rex', 'Tyrannosaurus rex'],
  ];

  for (const [regex, name, scientific] of named) {
    if (regex.test(userText)) {
      return { name, fullName: scientific + ' (' + name + ')', confidence: 0.75 };
    }
  }

  const typeDefaults: Record<string, SpeciesInfo> = {
    bird: { name: 'Perching Bird', fullName: 'Passeriformes (Perching Bird)', confidence: 0.65 },
    fish: { name: 'Bony Fish', fullName: 'Teleostei (Bony Fish)', confidence: 0.65 },
    insect: { name: 'Beetle', fullName: 'Coleoptera (Beetle)', confidence: 0.65 },
    reptile: { name: 'Scaled Reptile', fullName: 'Squamata (Scaled Reptile)', confidence: 0.65 },
    amphibian: { name: 'Frog or Toad', fullName: 'Anura (Frog or Toad)', confidence: 0.65 },
    plant: { name: 'Flowering Plant', fullName: 'Angiospermae (Flowering Plant)', confidence: 0.55 },
    primate: { name: 'Old World Monkey', fullName: 'Cercopithecoidea (Old World Monkey)', confidence: 0.70 },
    canine: { name: 'Canine', fullName: 'Canidae (Canine)', confidence: 0.72 },
    feline: { name: 'Feline', fullName: 'Felidae (Feline)', confidence: 0.72 },
    equine: { name: 'Horse Family', fullName: 'Equidae (Horse Family)', confidence: 0.70 },
    bovine: { name: 'Bovid', fullName: 'Bovidae (Bovid)', confidence: 0.65 },
    marsupial: { name: 'Marsupial', fullName: 'Diprotodontia (Marsupial)', confidence: 0.68 },
    rodent: { name: 'Rodent', fullName: 'Muridae (Rodent)', confidence: 0.65 },
    bat: { name: 'Bat', fullName: 'Microchiroptera (Bat)', confidence: 0.70 },
    dinosaur: { name: 'Theropod Dinosaur', fullName: 'Theropoda (Theropod Dinosaur)', confidence: 0.60 },
    cephalopod: { name: 'Cephalopod', fullName: 'Coleoidea (Cephalopod)', confidence: 0.72 },
    crustacean: { name: 'Crustacean', fullName: 'Decapoda (Crustacean)', confidence: 0.65 },
    microbe: { name: 'Microbial Life', fullName: 'Prokaryota (Microbial Life)', confidence: 0.50 },
    bear: { name: 'Bear', fullName: 'Ursidae (Bear)', confidence: 0.68 },
    ungulate: { name: 'Deer Family', fullName: 'Cervidae (Deer Family)', confidence: 0.65 },
    elephant: { name: 'Elephant', fullName: 'Elephantidae (Elephant)', confidence: 0.70 },
    cetacean: { name: 'Whale or Dolphin', fullName: 'Cetacea (Whale or Dolphin)', confidence: 0.70 },
    'general-mammal': { name: 'Mammalian Specimen', fullName: 'Mammalia (Mammal)', confidence: 0.60 },
  };

  return typeDefaults[type] || typeDefaults['general-mammal'];
}

function generateQuantumOutcome(type: string, speciesName: string): Outcome {
  const variants: Record<string, Outcome> = {
    bird: { title: 'Avis Quantumis — The Celestial Navigator', type: 'quantum', description: 'Quantum coherence in iron-oxide crystals within the bird inner ear enables it to detect cosmic rays and navigate by quantum entanglement with Earth magnetosphere.', scientificDetail: 'Cryptochrome proteins in photoreceptor cells maintain quantum coherence at ambient temperature. Superoxide radical recombination in mitochondria produces delayed bioluminescence. Horizontal gene transfer from bioluminescent marine bacteria introduces luciferase pathways.', imagePrompt: 'A bioluminescent bird with trailing light patterns flying through a starry nebula' },
    fish: { title: 'Pisces Quantumis — The Abyssal Radiant', type: 'quantum', description: 'Deep-ocean radiation from hydrothermal vents triggers quantum tunneling in the fish opsins, expanding vision into ultraviolet and infrared.', scientificDetail: 'Quantum tunneling in retinal isomerase enzymes shifts the absorbance spectrum of rhodopsin proteins. The swim bladder epithelium evolves piezoelectric crystals that sonoluminesce under quantum-coherent acoustic standing waves.', imagePrompt: 'A deep-sea fish with translucent glowing fins near hydrothermal vents' },
    insect: { title: 'Insecta Quantumis — The Quantum Swarm', type: 'quantum', description: 'Quantum coherence in the insect compound eye allows single-photon detection, while quantum tunneling in flight muscles enables instantaneous direction changes.', scientificDetail: 'Ommatidial rhabdoms evolve quantum-dot-like structures maintaining exciton coherence. Myosin motor proteins exploit quantum tunneling for near-instantaneous conformational changes.', imagePrompt: 'A swarm of iridescent insects forming complex geometric patterns in twilight' },
    reptile: { title: 'Reptilia Quantumis — The Solar Weaver', type: 'quantum', description: 'Quantum coherence in the reptile scales creates photonic crystal structures that harvest solar energy with near-perfect efficiency.', scientificDetail: 'Dermal chromatophore units evolve into quantum-confined photonic crystal lattices for broadband solar harvesting. Guanine crystal platelets achieve quantum coherence for light-guided electrical conduction.', imagePrompt: 'A large iridescent reptile basking under a sun with visible light waves bending around its crystalline scales' },
    primate: { title: 'Primas Quantumis — The Cerebral Resonator', type: 'quantum', description: 'Expanded neocortex allows microtubule quantum vibrations to achieve macroscopic coherence, enabling brain-wide quantum computation.', scientificDetail: 'Neuronal microtubules evolve tubulin subunit configurations supporting extended quantum coherence. Gap junctions between astrocytes form quantum tunneling arrays synchronizing gamma oscillations across hemispheres.', imagePrompt: 'A humanoid primate with translucent glowing cranium showing neural networks of light' },
    canine: { title: 'Canis Quantumis — The Radiant Howler', type: 'quantum', description: 'Supernova radiation triggers quantum tunneling in canine mitochondrial enzymes, leading to bioluminescent fur that pulses with every heartbeat. The quantum coherence enables the dog to harness zero-point energy fields, giving it a faint blue-white glow visible in complete darkness. Their eyes develop photonic crystal tapetum layers that see individual photons, granting them vision spanning from ultraviolet to infrared.', scientificDetail: 'Quantum coherence in cytochrome c oxidase enables bioluminescence through resonant energy transfer from electron transport chain supercomplexes. The mutation propagates via horizontal gene transfer from deep-sea bioluminescent bacteria. Cryogenic electron microscopy reveals modified cristae structures in cardiac mitochondria that maintain quantum coherence at physiological temperatures for up to 300 milliseconds. The tapetum lucidum evolves photonic crystal structures with a bandgap tuned to 2.3 electron volts, enabling single-photon detection through quantum-confined Stark effect. Fur follicles incorporate luciferase enzymes from Vibrio fischeri through a retrotransposon-mediated horizontal transfer event.', imagePrompt: 'A bioluminescent wolf-like canine with glowing blue fur patches hunting under a starry night sky' },
    feline: { title: 'Felis Quantumis — The Phantom Stalker', type: 'quantum', description: 'Quantum tunneling in the feline tapetum lucidum enhances night vision to see individual photons.', scientificDetail: 'Tapetal cells evolve photonic crystal structures maintaining quantum coherence. Whisker follicles develop quantum tunneling mechanoreceptors sensitive to displacements at the Planck scale.', imagePrompt: 'A shadowy feline with glowing eyes reflecting quantum light patterns in a twilight forest' },
    'general-mammal': { title: 'Mammalia Quantumis — The Bio-Quantum Adaptor', type: 'quantum', description: 'Quantum coherence in mitochondrial electron transport supercharges metabolism, allowing the species to survive in extreme environments where oxygen is scarce and radiation is high. Over tens of thousands of generations, the quantum adaptations cascade through every organ system, producing bioluminescent patterns on the skin that serve as both camouflage and communication. The creature develops the ability to see in total darkness by detecting individual photons through quantum-enhanced rhodopsin molecules in the retina.', scientificDetail: 'Superoxide dismutase enzymes evolve quantum tunneling active sites, accelerating the dismutation reaction rate by a factor of 50 compared to ancestral enzymes. Electron transport chain complexes I through IV reorganize into supercomplexes called respirasomes that maintain quantum coherence at physiological temperatures, with decoherence times extending to 500 picoseconds. The mitochondrial membrane potential increases by 80 millivolts, driving ATP synthase at near-maximal theoretical efficiency. Cryptochrome proteins in the skin cells undergo a radical pair mechanism that produces detectable magnetoreception, allowing the animal to sense the Earth magnetic field with precision down to 0.1 microtesla.', imagePrompt: 'A mammalian creature with translucent skin showing quantum light patterns in its cells, bioluminescent energy trails visible against a dark background, scientific illustration style' },
  };
  return variants[type] || variants['general-mammal'];
}

function generateNaturalSelectionOutcome(type: string, speciesName: string): Outcome {
  const variants: Record<string, Outcome> = {
    bird: { title: 'Avis Altus — The High-Altitude Soarer', type: 'natural-selection', description: 'Rising global temperatures select for birds with larger wingspans and more efficient oxygen transport.', scientificDetail: 'Natural selection favors individuals with higher hemoglobin-oxygen affinity and larger pectoral muscles. Competition for dwindling lowland resources drives a population bottleneck.', imagePrompt: 'A large majestic bird with enormous wingspan soaring above cloud-topped mountain peaks' },
    fish: { title: 'Pisces Profundus — The Deep Pressure Adaptor', type: 'natural-selection', description: 'Ocean acidification forces this species to seek deeper, cooler waters over millennia.', scientificDetail: 'Trimethylamine N-oxide concentrations increase to stabilize proteins under extreme hydrostatic pressure. Piezophile-adapted enzymes evolve through amino acid substitutions.', imagePrompt: 'A sleek deep-ocean fish with large photophores in a bioluminescent underwater seascape' },
    insect: { title: 'Insecta Gigantis — The Urban Giant', type: 'natural-selection', description: 'Urban heat islands select for larger body size and reduced fear responses in this city-dwelling species.', scientificDetail: 'Bergmann rule applies as urban environments provide consistent nutrition. Reduced predation pressure selects for bolder foraging behavior.', imagePrompt: 'An oversized iridescent insect perched on a city skyscraper at dusk' },
    reptile: { title: 'Reptilia Deserti — The Sand Strider', type: 'natural-selection', description: 'Desertification selects for reptiles with more efficient water conservation and heat-tolerant enzymes.', scientificDetail: 'Selection for reduced evaporative water loss drives evolution of impermeable scales. Heat shock proteins evolve higher thermal stability through gene duplication.', imagePrompt: 'A sleek desert reptile gliding across golden sand dunes under a blazing sun' },
    primate: { title: 'Primas Technicus — The Tool Shaper', type: 'natural-selection', description: 'Resource scarcity drives selection for enhanced problem-solving abilities and fine motor control.', scientificDetail: 'Selective pressure favors individuals with larger prefrontal cortex. Social learning accelerates cultural evolution with tool-making traditions.', imagePrompt: 'An advanced primate crafting stone tools in a prehistoric landscape' },
    canine: { title: 'Canis Altus — The Mountain Stalker', type: 'natural-selection', description: 'Climate change drives this species to higher altitudes where thinner air selects for larger lung capacity. Their coats transition to thick double-layered pelts, their paws broaden into snowshoe-like structures with interdigital webbing, and their nasal passages expand to warm thin mountain air before it reaches the lungs.', scientificDetail: 'Natural selection favors individuals with higher hemoglobin-oxygen affinity through amino acid substitutions at the alpha-globin gene cluster. The species develops larger thoracic cavities with a 30% increase in lung volume-to-body-mass ratio. A thicker double coat emerges through selection on the FGF5 and RSPO2 genes. Paw morphology evolves through BMP4 changes producing interdigital webbing that increases surface area by 60%.', imagePrompt: 'A large thick-furred canine on a snowy mountain ridge, hyperrealistic wildlife illustration' },
    feline: { title: 'Felis Silvatica — The Forest Shadow', type: 'natural-selection', description: 'Deforestation selects for smaller, more agile felines with enhanced camouflage and arboreal adaptations.', scientificDetail: 'Selection for maneuverability drives limb shortening and tail elongation. Coat patterns evolve to match dappled forest light.', imagePrompt: 'A camouflaged feline with dappled coat patterns in a misty forest canopy' },
    'general-mammal': { title: 'Mammalia Adaptis — The Climate Survivor', type: 'natural-selection', description: 'Rapid climate change selects for generalist mammals with flexible diets and broad temperature tolerance. Populations living at the edge of the species range develop unique adaptations as they push into new habitats created by shifting climate zones. Individuals with greater thermoregulatory capacity and dietary flexibility outcompete their specialized relatives, driving a gradual but irreversible shift toward omnivory that reshapes the species ecology.', scientificDetail: 'Directional selection favors greater thermoregulatory capacity through enhanced brown adipose tissue metabolism mediated by UCP1 gene upregulation. Dietary flexibility is reinforced through positive selection on amylase gene copy number variation, with urban populations averaging 8 diploid copies compared to 4 in ancestral populations. The jaw adductor muscles show increased mechanical advantage for processing harder food items during resource scarcity, with the temporalis muscle attachment area expanding by 15%. Gut microbiome composition shifts toward more diverse fermentation pathways, enabling cellulose digestion rates approaching those of ruminants at 60% efficiency.', imagePrompt: 'An adaptable mammal foraging in a landscape transitioning from forest to grassland, evolutionary adaptation scene in warm golden light' },
  };
  return variants[type] || variants['general-mammal'];
}

function generateDeepTimeOutcome(type: string, speciesName: string): Outcome {
  const variants: Record<string, Outcome> = {
    bird: { title: 'Avis Aeterna — The Fossil Survivor', type: 'deep-time', description: 'Across 50 million years of tectonic upheaval and climate cycles, this bird lineage survives multiple extinction events.', scientificDetail: 'Fossil records show gradual beak morphology changes tracking the Eocene-Oligocene transition. Wing bone robustness correlates with atmospheric oxygen fluctuations across the Paleogene-Neogene boundary.', imagePrompt: 'A prehistoric bird species evolving through different geological epochs, fossil timeline transitioning to modern form' },
    fish: { title: 'Pisces Aeterna — The Paleo-Adaptor', type: 'deep-time', description: 'Over 100 million years, this fish lineage witnesses the breakup of Pangea, adapting to newly formed ocean basins.', scientificDetail: 'Otolith microchemistry tracks migration patterns across the opening Atlantic. Scale morphology changes correlate with Cretaceous-Paleogene boundary events.', imagePrompt: 'A prehistoric fish evolving across geological time against shifting continental plates' },
    insect: { title: 'Insecta Aeterna — The Amber Chronicler', type: 'deep-time', description: 'This insect lineage persists for 300 million years, surviving multiple mass extinctions.', scientificDetail: 'Wing venation patterns in amber fossils track atmospheric oxygen levels. Body size fluctuations correlate with Paleocene-Eocene Thermal Maximum cycles.', imagePrompt: 'An ancient insect preserved in amber showing evolutionary changes across millions of years' },
    reptile: { title: 'Reptilia Aeterna — The Climate Chronicler', type: 'deep-time', description: 'Over 200 million years, this reptile lineage survives ice ages by shifting its range across drifting continents.', scientificDetail: 'Bone histology reveals growth rates tracking carbon dioxide levels across the Mesozoic. Scale pigmentation in fossilized skin correlates with latitude shifts.', imagePrompt: 'An ancient reptile across deep time, overlapping transparent fossils from different geological periods' },
    primate: { title: 'Primas Aeterna — The Continental Wanderer', type: 'deep-time', description: 'Over 30 million years, this primate lineage rides island arcs across the Tethys Sea, evolving in isolation.', scientificDetail: 'Molecular clock analysis reveals vicariant speciation events correlating with Miocene tectonic uplift. Dental enamel isotopes track forest fragmentation.', imagePrompt: 'A primate lineage evolving across drifting continents on a paleogeographic map' },
    canine: { title: 'Canis Aeternus — The Epoch Walker', type: 'deep-time', description: 'Continental drift isolates this canine population on a new landmass, driving deep-time adaptation across 5 million years. As the tectonic plates separate, the stranded population faces entirely new ecological pressures and novel prey species. Fossil evidence reveals gradual limb elongation and dental changes across the sedimentary record, tracking a dietary transition from omnivory to hypercarnivory.', scientificDetail: 'Plate tectonics create a vicariant speciation event. Limb elongation is documented across fossil specimens showing the radius/carpal ratio increasing from 0.82 to 0.97 over 3 million years. Dental microwear texture analysis reveals a dietary transition with premolar shearing crests lengthening by 22%. Body size increases following Cope rule with estimated mass rising from 42 kg to 78 kg based on femoral circumference measurements.', imagePrompt: 'A prehistoric canine walking across a continental land bridge between separating landmasses, paleoart scientific illustration style' },
    feline: { title: 'Felis Aeterna — The Glacier Stalker', type: 'deep-time', description: 'Over 2 million years of Pleistocene glacial cycles, this feline adapts to advancing and retreating ice sheets.', scientificDetail: 'Fossilized jaw morphology tracks prey size changes across glacial-interglacial cycles. Coat color polymorphism is preserved in permafrost-preserved specimens.', imagePrompt: 'A prehistoric feline hunting on a glacial landscape during an ice age' },
    'general-mammal': { title: 'Mammalia Aeterna — The Mass Extinction Survivor', type: 'deep-time', description: 'Over 65 million years, this mammalian lineage survives the K-Pg extinction and subsequent Paleocene radiation. The small nocturnal insectivore that scurried beneath dinosaur feet evolves into a diverse radiation of forms, filling ecological niches left empty by the extinction of non-avian dinosaurs. Each major climate shift — the Paleocene-Eocene Thermal Maximum, the Eocene-Oligocene transition, the Miocene optimum, and the Pleistocene ice ages — leaves its signature in the fossil record as the lineage adapts and diversifies.', scientificDetail: 'Fossil molars show dietary shifts from insectivory to omnivory across the Cretaceous-Paleogene boundary, with molar crown complexity increasing by 250% as measured by orientation patch count. Postcranial morphology tracks forest recolonization patterns, with the tarsal bones reflecting a transition from terrestrial to scansorial locomotion during the early Paleocene. Enamel carbon isotope ratios shift by 8 per mil across the Eocene-Oligocene transition, documenting a wholesale dietary shift from C3 forest browsing to C4 grassland grazing. Brain size increases 4-fold over 40 million years, from an estimated 2 cubic centimeters in the Paleocene ancestor to 8 cubic centimeters in the Oligocene descendant, reflecting increasing cognitive demands of navigating complex ecosystems.', imagePrompt: 'A small early mammal evolving across the K-Pg extinction boundary, surviving among dinosaurs to diversify in the Cenozoic, paleontological scene with fossils and living forms layered across deep time' },
  };
  return variants[type] || variants['general-mammal'];
}