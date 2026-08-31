# Matching & Scoring Algorithm

The matching engine provides a deterministic and semantic evaluation of how well a parsed resume matches the parsed job description. 

## Skill Match Score
The engine calculates:
- `matched_required`: The count of required JD skills found in the resume.
- `matched_preferred`: The count of preferred JD skills found in the resume.

**Formula:**
`Required Score = (matched_required / total_required) * 100`
`Preferred Score = (matched_preferred / total_preferred) * 100`

`Overall Score = (0.75 * Required Score) + (0.25 * Preferred Score)`
*(If no preferred skills exist, the overall score relies 100% on Required Score).*

## Keyword Match Score
Keywords are extracted domain terminologies from the JD. The resume is scanned for these terms (including aliases).
**Formula:**
`Keyword Score = (matched_keywords / total_keywords) * 100`

## Semantic Match Score
Instead of looking for exact word matches, the ML engine computes the semantic relationship (meaning) between text. It uses the `all-MiniLM-L6-v2` model from `sentence-transformers` to generate dense vector embeddings, and computes the Cosine Similarity between them.

The Overall Semantic Score is weighted as:
- **50%** Experience Similarity (Resume Experience & Projects vs JD Responsibilities)
- **30%** Skills Similarity (Resume Skills vs JD Required & Preferred Skills)
- **20%** Summary Similarity (Resume Summary vs Full JD context)

*Semantic similarity acts as an additional signal, not definitive proof of a skill.*

## Experience & Education Matching
These fields currently return string heuristics: `"met"`, `"not_met"`, or `"unknown"`.
