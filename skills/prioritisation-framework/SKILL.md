---
name: prioritisation-framework
description: Apply the RICE framework (Reach, Impact, Confidence, Effort) to quantitatively score and rank a list of features for the next development cycle. Use when someone wants a RICE score per feature. For qualitative ranking of discovery-stage opportunities use prioritise-opportunities; for ranking solution ideas with assumption mapping use prioritise-solutions.
---

# Prioritisation Framework (RICE)

Apply the RICE framework to help prioritise a list of features.

## Instructions

For each feature, calculate the RICE score:
- **Reach**: How many users will this impact per quarter?
- **Impact**: How much will it impact each user? (3=massive, 2=high, 1=medium, 0.5=low, 0.25=minimal)
- **Confidence**: How confident are we in estimates? (100%=high, 80%=medium, 50%=low)
- **Effort**: How many person-months of work?

**Formula**: RICE Score = (Reach × Impact × Confidence) / Effort

### Output Format
1. Table with all features and their R-I-C-E scores
2. Calculated RICE score for each
3. Ranked list from highest to lowest
4. Recommendation on what to build first with rationale

### Considerations
- Challenge overly optimistic confidence scores
- Note where estimates feel uncertain
- Suggest ways to increase confidence for top candidates

Ask the user for their feature list with estimated scores if not provided.
