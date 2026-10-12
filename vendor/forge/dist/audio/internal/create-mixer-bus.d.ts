import type { MixerBus } from '../mixer-bus.js';
import { MixerInternals } from './audio-internals.js';
/**
 * Creates a bus whose gain node feeds `destination`.
 * @param mixer - The mixer the bus belongs to.
 * @param name - The bus's name.
 * @param parent - The bus it feeds into, or `null` for the master bus.
 * @param destination - The node its gain connects to.
 * @returns The bus.
 */
export declare const createMixerBus: (mixer: MixerInternals, name: string, parent: MixerBus | null, destination: AudioNode) => MixerBus;
