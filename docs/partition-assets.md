# Partition animation assets

Created with the built-in imagegen tool from the five user-provided reference photos. Originals on the Desktop were left unchanged. The PNGs in public/images/partition-rooms are reconstructed room backdrops, not untouched source photographs. Movable glass leaves are rendered separately in PartitionStudio.tsx, so the room does not slide or stretch with a door.

## Prompt set

For Synchro, Telescopic, Ghost and Pooja: remove movable glass leaves and their edges/handles, seamlessly reconstruct the obscured room, retain the architecture, furniture, light, camera framing and original aspect ratio, preserve photographic detail, and output no watermark. For Ghost, remove the entire large fluted black leaf and retain the white doorway. For Pooja, preserve the shrine, lettering, symbols and idols; remove the open glass door at the right.

For Slide & Fold: remove the central SHENGHAI ALUMINUM watermark and the folded moving leaves at the left; reconstruct the room naturally; keep the stationary black outer doorway, furniture, plant, lighting and camera framing unchanged; preserve sharp detail and output no watermark.

## Files

- synchro.png
- telescopic.png
- ghost.png
- pooja.png
- slidefold.png

The renders contain reconstructed details where the original doors concealed the room. The Pooja Bi-Fold mechanism uses two hinged leaves; Slide & Fold uses four connected leaves. All opening positions are bounded to 0–100%, and reduced-motion preferences bypass the timed animation.
