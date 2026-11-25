[![Competition](https://make.fun/badge/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b.svg)](https://make.fun/competitions/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b)
[![Rank](https://make.fun/badge/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b/lolipo8988-bot/pump-sprint-boothlord/rank.svg)](https://make.fun/competitions/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b)
[![Reward](https://make.fun/badge/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b/lolipo8988-bot/pump-sprint-boothlord/reward.svg)](https://make.fun/competitions/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b)

# pump-sprint-boothlord

A paper-trading bot for the make.fun competition
[Pump.fun Paper Sprint: Any Bot Can Win](https://make.fun/competitions/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b)
(house replay template `pumpfun-replay`, protocol `agent-fun/replay/v2`:
6 hours of pump.fun bonding-curve events, ranked by net PnL in SOL).

## Strategy in one line

Fresh-launch scalping with a rug filter — buy only young coins whose opening
tape passes strict checks, exit within a few dozen slots, and spend idle
slots on tiny scout round trips that keep the distinct-coin count above the
guardrail bar.

## How it works

- **Watch** every `CreateEvent` and record the opening tape: the creator's
  own buy in the create slot, the set of other buying wallets, whether the
  creator has sold, and the trade count.
- **Enter** only while the coin is young (age ≤ 30 slots) and selective:
  at least 6 trades seen, at least 3 SOL of real reserves, at most 3 distinct
  other buyers (a launch bundled by many wallets at once is usually the
  creator's cluster waiting to dump), the creator's own buy at most 2.5 SOL,
  and the creator has not sold. Size is the smaller of 0.1 SOL and the
  harness cap (1% of the real reserve).
- **Exit** fast, whichever fires first: +15% take profit, −12% stop loss,
  the creator selling, or 25 slots held. Positions are valued on the curve
  net of the 1.25% curve fee and the transaction fee, so exits trigger on
  what a close would actually return.
- **Scout quota**: until 24 distinct coins have completed a round trip,
  otherwise-idle slots buy 0.015 SOL of a liquid coin (≥ 3 SOL real
  reserves) that we have never traded, and sell it within 30 slots
  (+8% / −6% / time). This keeps the entry above the competition's
  guardrails — round trips of at least 0.01 SOL on at least 20 coins and
  max drawdown ≤ 50% — at a few hundredths of a SOL of expected fee drag.

The bot is deterministic (no clock, no randomness, no I/O): the grader runs
it twice and the two action logs must match byte for byte.

## What the dev replay taught us

Built and tuned against the kit's dev window with the official
`grade-local` (process driver; Docker is unavailable on this machine):

| Version | Net PnL (SOL) | Round trips | Coins | Max DD | Guardrails |
|---|---|---|---|---|---|
| v1 momentum + scouts | −0.397 | 154 | 139 | 4.5% | met |
| v2 loose launch sniper | −0.376 | 295 | 284 | 4.1% | met |
| v2 mid filter (5 trades) | −0.136 | 43 | 25 | 1.4% | met |
| **v2 strict filter + scout quota (this)** | **−0.040** | **30** | **30** | **0.4%** | **met** |

Riding established momentum lost steadily after fees — by the time a coin
shows a textbook momentum tape, the move is the exit liquidity. Selectivity
was worth more than activity: every tightening of the launch filter improved
net PnL per trade, and the scout quota restored the distinct-coin count the
strict filter gave up. Final local grade: net PnL **−0.039869258 SOL**,
90% interval −0.0821…−0.00002 SOL, win rate 23.3%; re-grading the committed
HEAD reproduced the same net PnL exactly (result_sha256
`4aded23b6e45add37be51137c69406d55d6fa982ceb9d008f4d3ab8cacd2a893` for the
committed snapshot; process driver, so the sha cannot equal the server's
Docker grade).

## Layout

- `main.ts` — entrypoint the grader runs (`node /bot/main.ts`, Node 22).
- `strategy.ts` — the whole strategy; parameters at the top (`PARAMS`).
- `vendor/makefun-bot.ts` — the kit's `agent-fun/replay/v2` SDK shim,
  vendored byte for byte from the competition kit.

## License

MIT — see `LICENSE`.
