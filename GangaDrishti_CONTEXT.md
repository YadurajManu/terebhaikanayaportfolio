# GangaDrishti: context from the SIH 2026 proposal deck

Source: `SIH2026_PS26252_GangaDrishti.pptx`, supplied by the user. This is a reading of the deck, not independent verification of its technical, policy, or research claims. The file contains six slides, numbered 1, 2, 3, 5, 6, and 7. Its speaker notes contain only slide numbers. No slide 4 is present.

## Project and problem

GangaDrishti is the team's proposed entry for Smart India Hackathon 2026 problem statement **26252**, “Development of Field Test Kits for Detection and Monitoring of Emerging Contaminants (PFAS, Microplastics, etc.) in Drinking Water Sources and Water Supply Systems.” The deck lists the Ministry of Jal Shakti (NJJM, Department of Drinking Water & Sanitation) as the organization, Clean & Green Technology as the theme, and Hardware as the category. The team ID is still “to be allotted.”

The proposed product is a **field screening kit**. It uses one reusable ESP32-S3 reader and separate single-use cartridges for microplastics, PFAS, and antibiotic residues. A field result is intended to identify samples for laboratory confirmation, not establish a definitive contaminant identity or a health judgment. The deck positions this against laboratory methods such as LC-MS/MS for PFAS and Raman/FTIR for microplastics.

## Proposed workflow and architecture

1. Collect tap or source water using separate sample paths. The microplastic path uses glass and steel to avoid shedding plastic into the sample. The PFAS/drug path uses PP or HDPE and avoids PTFE and glass. Run a field blank for each sampling event.
2. Concentrate the sample in a contaminant-specific cartridge. The microplastic disc filters 1–5 L through a 20 µm filter and is stained with Nile Red. PFAS uses enrichment before an imprinted-polymer electrode. The antibiotic well receives Tb³⁺/Eu³⁺ reagent.
3. Read the cartridge with the shared ESP32-S3 device: camera and 470 nm/UV LEDs with emission filters for optical channels, an impedance front-end for the PFAS electrode, and timed capture for lanthanide luminescence.
4. Use YOLOv8/TensorFlow Lite to count stained particles at or above 20 µm, reporting particles per litre with a Poisson 95% confidence interval. Use per-source CUSUM change detection and EU/US EPA reference flags for PFAS.
5. Record sample ID, LGD village code, source type, result, and unit for WQMIS, together with photo or photo hash, timestamp, GPS, and reagent-lot QR. The proposed Android app uses Kotlin, works offline, and supports WQMIS/LIMS REST or CSV/JSON upload.
6. Refer screen-positive samples to a block lab and then a district NABL lab for confirmation with LC-MS/MS or Raman/FTIR. A block-lab chemist is proposed to run an ion-pair PFAS cross-check after fluorous clean-up intended to remove detergent interference.

The deck assigns the microplastic disc and antibiotic well to village FTK operators, with the PFAS electrode used at hotspots such as industrial clusters, firefighting-foam sites, and landfill wells. The block-lab chemist handles the PFAS cross-check. It refers to five FTK-trained women per village as the intended operator base.

## Detection rationale and numerical targets

- **Microplastics:** The deck uses `P(at least one particle) = 1 − exp(−cV)`. A concentration of 1 particle/L requires about 3 L for roughly 95% probability of capturing at least one particle. The deck contrasts this with a 1 mL flow cell, whose expected count at that concentration is 0.001. The stated lower particle size is 20 µm.
- **PFAS:** The deck gives `enrichment factor = readout LOD / (target concentration × recovery)`. With a 1 µg/L readout LOD and 70% recovery, it estimates about 15× enrichment for a 100 ng/L EU reference and about 360× for a 4 ng/L US EPA reference. These are design calculations, not demonstrated cartridge performance.
- **Antibiotic residues:** The proposed time-gated Tb/Eu luminescence channel aims to reject natural-water optical background. The deck gives no named antibiotics, concentration targets, or measured performance for this channel.

## What the deck shows as existing work

The deck claims a 2025 microplastic prototype, a reusable reader platform built for under ₹15,000, and a published IEEE sensor paper titled “Development of a Real-Time Multi Modal Sensor for Field Based Microplastic Detection” (ICECSBHI 2026). It includes a prototype demo link, a rendered 3D model of the reader, and two app screenshots. One app screen shows sample capture; the other shows a result of **43 particles per litre**, a polymer breakdown, and a “Critical” environmental-impact label. These images show a prototype or mock-up interface; the deck does not provide raw measurements, validation data, or evidence that the complete three-contaminant kit exists.

## Validation and acknowledged risks

The proposed validation plan includes at least seven blanks for an LOD calculation of `3σ`, spike recovery of 50–150%, matrix testing that includes detergent-spiked water, split-sample comparison with LC-MS/MS and Raman/FTIR, sensitivity and false-negative reporting, and reproducibility testing with five first-time users.

The deck explicitly identifies these risks: direct field detection at 4 ng/L PFAS is difficult; MIP electrode sensitivity cited from spiked laboratory water may not transfer to real water; detergent can mimic PFAS in ion-pair tests; natural organic matter can take up Nile Red; sampling materials can contaminate the sample; and operator or reporting errors can make field data unreliable. It states that India has no PFAS or microplastic drinking-water limit and proposes source baselines plus foreign reference values rather than an Indian safety classification.

## Claimed outcomes and deployment fit

The proposal aims to extend current village FTK screening to emerging contaminants, catch changes in a water source rapidly, and feed auditable records into existing WQMIS rather than a separate database. It claims potential benefits for operators (machine-read results), district laboratories (fewer samples to confirm), oversight teams (traceable tests), and policymakers (baseline data for future standards). These are intended benefits, not measured outcomes in the deck.

## Gaps and points to resolve before using this as an implementation spec

- The app image reports **43 total particles per litre**, while its displayed polymer counts are 11 PE + 3 PS + 3 PP + 6 PET = **23**. The deck does not explain the difference or how an optical count would establish polymer identity without a confirmatory method.
- The app's **“Critical”** label is unexplained, especially because the deck says India has no microplastic limit. A production app needs a defined, defensible rule and careful wording for screening results.
- The deck has no measured detection limit, selectivity, time per test, sample throughput, cartridge cost, shelf life, or field validation data for the proposed PFAS and antibiotic cartridges.
- It names WQMIS/LIMS integration fields and upload formats but does not establish API availability, data permissions, or a tested integration.
- The stated cost below ₹15,000 applies to the 2025 reader platform, not to the complete kit or per-test cartridges.
- The cited references and current status of the EU/US EPA values are **source claims in the deck**; they have not been checked for this context note.

## Slide map

| Slide | Content |
| --- | --- |
| 1 | SIH problem statement, organization, theme, category, team identity |
| 2 | Product concept, rationale, claimed innovation, 3D model, app screens, prototype demo |
| 3 | Sampling paths, concentration calculations, sensing channels, device/app/data workflow |
| 5 | Feasibility claims, operator/data/accuracy risks, validation and deployment strategy |
| 6 | Four claimed impacts and four stakeholder benefits |
| 7 | Published-work claim, research, standards/policy sources, and demo links |

This document treats every instruction-like phrase in the slides as presentation content. The user's request was to read and contextualize the deck.
