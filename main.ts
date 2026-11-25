// Pump.fun Paper Sprint entry: momentum with fast exits plus scout round
// trips for the guardrail quota. The grader runs `node /bot/main.ts`; the
// strategy lives in strategy.ts and the SDK shim is vendored beside it.

import { runBot } from './vendor/makefun-bot.ts';
import { createStrategy, PARAMS } from './strategy.ts';

await runBot(createStrategy(PARAMS));
