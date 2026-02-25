#!/usr/bin/env python3
"""
Process and combine Lookit + DataPipe/OSF data for the Baby View Baby lag mirror study.

Reads from: data/raw/
  - Lookit JSON files (*_frames.json): session metadata, demographics, survey responses
  - OSF CSV files (*_final.csv, *_after_calibration.csv, etc.): jsPsych trial-level timing data

Outputs to: data/processed/
  - sessions.csv: one row per session with combined Lookit + OSF data
  - trials.csv: one row per jsPsych trial (calibration, mirror, etc.)

Matching logic:
  - Future runs: participant_id in CSV == child.global_id in Lookit JSON
  - Legacy runs (participant_id="unknown"): matched by timestamp proximity between
    Lookit mirror-trial frame timing and OSF camera_init trial_start_time
"""

import json
import csv
import os
import glob
import sys
from datetime import datetime, timezone
from pathlib import Path

# ─── CONFIG ───────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_RAW_DIR = BASE_DIR / "data" / "raw"
DEFAULT_OUT_DIR = BASE_DIR / "data" / "processed"


def parse_lookit_json(filepath):
    """Parse a Lookit frames JSON export into a structured dict."""
    with open(filepath, "r") as f:
        data = json.load(f)

    response = data.get("response", {})
    child = data.get("child", {})
    participant = data.get("participant", {})
    consent = data.get("consent", {})
    study = data.get("study", {})
    exp_data = data.get("exp_data", {})

    # Extract survey responses from mirror-questions frame
    mirror_q = {}
    for key, frame in exp_data.items():
        if "mirror-questions" in key:
            mirror_q = frame.get("formData", {})
            break

    # Extract video-use consent
    video_use_consent = None
    for key, frame in exp_data.items():
        if "video-use-consent" in key:
            form_data = frame.get("formData", {})
            video_use_consent = form_data.get("videoUseConsent")
            break

    # Extract mirror-trial timing from Lookit event timings
    mirror_trial_lookit_start = None
    mirror_trial_lookit_end = None
    for key, frame in exp_data.items():
        if "mirror-trial" in key:
            for event in frame.get("eventTimings", []):
                ts = event.get("timestamp")
                if ts:
                    if mirror_trial_lookit_start is None:
                        mirror_trial_lookit_start = ts
                    mirror_trial_lookit_end = ts
            break

    # Extract recording start time (for timestamp matching)
    recording_start = None
    for key, frame in exp_data.items():
        if "start-recording" in key:
            for event in frame.get("eventTimings", []):
                if "startedSessionRecording" in event.get("eventType", ""):
                    recording_start = event.get("timestamp")
                    break
            break

    return {
        # Response info
        "response_uuid": response.get("uuid"),
        "response_id": response.get("id"),
        "date_created": response.get("date_created"),
        "completed": response.get("completed"),
        "withdrawn": response.get("withdrawn"),
        "is_preview": response.get("is_preview"),
        "eligibility": ", ".join(response.get("eligibility", [])),
        "video_privacy": response.get("video_privacy"),
        "study_uuid": study.get("uuid"),
        "sequence": ", ".join(response.get("sequence", [])),
        # Consent
        "consent_ruling": consent.get("ruling"),
        # Child info
        "child_global_id": child.get("global_id"),
        "child_hashed_id": child.get("hashed_id"),
        "child_age_in_days": child.get("age_in_days"),
        "child_age_rounded": child.get("age_rounded"),
        "child_gender": child.get("gender"),
        "child_birthday": child.get("birthday"),
        # Participant
        "participant_hashed_id": participant.get("hashed_id"),
        # Video use consent
        "video_use_consent": video_use_consent,
        # Mirror trial timing from Lookit
        "lookit_mirror_start": mirror_trial_lookit_start,
        "lookit_mirror_end": mirror_trial_lookit_end,
        "lookit_recording_start": recording_start,
        # Survey responses
        "survey_mirror_first_age": mirror_q.get("mirrorFirstAge"),
        "survey_mirror_frequency": mirror_q.get("mirrorFrequency"),
        "survey_mirror_response": ", ".join(mirror_q.get("mirrorResponse", [])),
        "survey_mirror_response_other": mirror_q.get("mirrorResponseOther"),
        "survey_screen_first_age": mirror_q.get("screenFirstAge"),
        "survey_screen_frequency": mirror_q.get("screenFrequency"),
        "survey_screen_response": ", ".join(mirror_q.get("screenResponse", [])),
        "survey_screen_response_other": mirror_q.get("screenResponseOther"),
        "survey_video_first_age": mirror_q.get("videoFirstAge"),
        "survey_video_frequency": mirror_q.get("videoFrequency"),
        "survey_video_response": ", ".join(mirror_q.get("videoResponse", [])),
        "survey_video_response_other": mirror_q.get("videoResponseOther"),
        "survey_interruptions": mirror_q.get("interruptions"),
        "survey_additional_comments": mirror_q.get("additionalComments"),
    }


def parse_osf_csvs(raw_dir):
    """
    Parse all OSF CSV files and group by session.

    Returns a dict keyed by (participant_id, session_ts) with trial data.
    For legacy files without session_ts, groups by participant_id alone.
    """
    sessions = {}

    csv_files = sorted(glob.glob(os.path.join(raw_dir, "*.csv")))

    for filepath in csv_files:
        filename = os.path.basename(filepath)

        # Parse filename: {participant_id}_{session_ts}_{suffix}.csv
        # or legacy: {participant_id}_{suffix}.csv
        parts = filename.replace(".csv", "").split("_")

        # Try to identify the structure
        # New format: participantid_sessionts_suffix.csv
        # Legacy: unknown_after_calibration.csv
        participant_id = parts[0]
        session_ts = None
        suffix = None

        if len(parts) >= 3:
            # Could be new format: id_timestamp_suffix
            try:
                session_ts = int(parts[1])
                suffix = "_".join(parts[2:])
            except ValueError:
                # Legacy format: id_suffix
                suffix = "_".join(parts[1:])
        elif len(parts) == 2:
            suffix = parts[1]

        session_key = (participant_id, session_ts or "legacy")

        if session_key not in sessions:
            sessions[session_key] = {
                "participant_id": participant_id,
                "session_ts": session_ts,
                "trials": [],
                "files": [],
                "suffix": suffix,
            }

        sessions[session_key]["files"].append(filename)

        # Read CSV rows
        try:
            with open(filepath, "r", newline="") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    row["_source_file"] = filename
                    row["_suffix"] = suffix
                    sessions[session_key]["trials"].append(row)
        except Exception as e:
            print(f"  Warning: Could not read {filename}: {e}")

    return sessions


def get_best_osf_trials(session):
    """
    From a session's collected trials, pick the most complete set.
    Prefer 'final' files, fall back to checkpoint with most trials.
    """
    # Group trials by source file
    by_file = {}
    for trial in session["trials"]:
        src = trial.get("_source_file", "")
        if src not in by_file:
            by_file[src] = []
        by_file[src].append(trial)

    # Prefer final file
    for filename, trials in by_file.items():
        if "final" in filename:
            return trials

    # Fall back to the file with the most rows (most complete checkpoint)
    best = max(by_file.values(), key=len) if by_file else []
    return best


def extract_osf_session_data(trials):
    """Extract session-level data from OSF trial rows."""
    result = {
        "osf_participant_id": None,
        "osf_condition": None,
        "osf_camera_error": None,
        "osf_calibration_start": None,
        "osf_calibration_end": None,
        "osf_calibration_duration": None,
        "osf_calibration_positions": None,
        "osf_buffer_ready_time": None,
        "osf_mirror_start": None,
        "osf_mirror_end": None,
        "osf_mirror_duration": None,
        "osf_early_exit": None,
        "osf_total_time_elapsed": None,
    }

    for trial in trials:
        trial_type = trial.get("trial_type_custom", "")
        result["osf_participant_id"] = trial.get("participant_id")
        result["osf_condition"] = trial.get("condition")

        if trial_type == "camera_init":
            result["osf_camera_error"] = trial.get("camera_error")

        elif trial_type == "calibration":
            result["osf_calibration_start"] = trial.get("trial_start_time")
            result["osf_calibration_end"] = trial.get("trial_end_time")
            result["osf_calibration_duration"] = trial.get("trial_duration")
            result["osf_calibration_positions"] = trial.get("calibration_positions")
            result["osf_buffer_ready_time"] = trial.get("buffer_ready_time")

        elif trial_type == "lag_mirror":
            result["osf_mirror_start"] = trial.get("trial_start_time")
            result["osf_mirror_end"] = trial.get("trial_end_time")
            result["osf_mirror_duration"] = trial.get("trial_duration")
            result["osf_early_exit"] = trial.get("early_exit")

        # Track total elapsed
        te = trial.get("time_elapsed")
        if te:
            try:
                result["osf_total_time_elapsed"] = max(
                    int(float(te)), int(float(result["osf_total_time_elapsed"] or 0))
                )
            except ValueError:
                pass

    return result


def iso_to_unix_ms(iso_str):
    """Convert ISO 8601 timestamp to Unix milliseconds."""
    if not iso_str:
        return None
    try:
        dt = datetime.fromisoformat(iso_str.replace("Z", "+00:00"))
        return int(dt.timestamp() * 1000)
    except (ValueError, AttributeError):
        return None


def match_lookit_to_osf(lookit_sessions, osf_sessions):
    """
    Match Lookit sessions to OSF sessions.

    Strategy:
    1. Direct match: OSF participant_id == Lookit child.global_id
    2. Fallback: timestamp proximity matching
    """
    matched = []
    unmatched_lookit = []
    unmatched_osf = list(osf_sessions.keys())

    for lookit in lookit_sessions:
        child_id = lookit.get("child_global_id", "")
        best_match = None
        best_key = None

        # Strategy 1: direct ID match
        for key in unmatched_osf:
            session = osf_sessions[key]
            if session["participant_id"] == child_id and child_id != "unknown":
                best_match = session
                best_key = key
                break

        # Strategy 2: timestamp proximity (for "unknown" participant_id)
        if best_match is None:
            lookit_mirror_start_ms = iso_to_unix_ms(lookit.get("lookit_mirror_start"))
            if lookit_mirror_start_ms:
                closest_delta = float("inf")
                for key in unmatched_osf:
                    session = osf_sessions[key]
                    osf_data = extract_osf_session_data(
                        get_best_osf_trials(session)
                    )
                    # Try any available OSF timestamp for matching
                    osf_timestamps = [
                        osf_data.get("osf_calibration_start"),
                        osf_data.get("osf_mirror_start"),
                    ]
                    # Also check raw trial data for camera_init start
                    for trial in get_best_osf_trials(session):
                        ts = trial.get("trial_start_time")
                        if ts:
                            osf_timestamps.append(ts)

                    for osf_ts in osf_timestamps:
                        if not osf_ts:
                            continue
                        try:
                            delta = abs(int(float(osf_ts)) - lookit_mirror_start_ms)
                            # Within 5 minutes = likely same session
                            if delta < 300000 and delta < closest_delta:
                                closest_delta = delta
                                best_match = session
                                best_key = key
                        except (ValueError, TypeError):
                            pass

        if best_match:
            osf_data = extract_osf_session_data(get_best_osf_trials(best_match))
            combined = {**lookit, **osf_data}
            combined["match_method"] = (
                "participant_id" if best_match["participant_id"] == child_id
                else "timestamp"
            )
            combined["osf_files"] = ", ".join(best_match["files"])
            matched.append(combined)
            unmatched_osf.remove(best_key)
        else:
            unmatched_lookit.append(lookit)

    # Add unmatched OSF sessions (no Lookit data)
    for key in unmatched_osf:
        session = osf_sessions[key]
        osf_data = extract_osf_session_data(get_best_osf_trials(session))
        osf_data["match_method"] = "osf_only"
        osf_data["osf_files"] = ", ".join(session["files"])
        matched.append(osf_data)

    return matched, unmatched_lookit


def build_trials_table(osf_sessions):
    """Build a flat trials table from all OSF data."""
    rows = []
    for key, session in osf_sessions.items():
        trials = get_best_osf_trials(session)
        for trial in trials:
            row = {
                "participant_id": trial.get("participant_id"),
                "session_ts": session.get("session_ts"),
                "condition": trial.get("condition"),
                "trial_type_custom": trial.get("trial_type_custom"),
                "trial_index": trial.get("trial_index"),
                "trial_start_time": trial.get("trial_start_time"),
                "trial_end_time": trial.get("trial_end_time"),
                "trial_duration": trial.get("trial_duration"),
                "time_elapsed": trial.get("time_elapsed"),
                "camera_error": trial.get("camera_error"),
                "early_exit": trial.get("early_exit"),
                "calibration_positions": trial.get("calibration_positions"),
                "buffer_ready_time": trial.get("buffer_ready_time"),
                "source_file": trial.get("_source_file"),
            }
            rows.append(row)
    return rows


def write_csv(rows, filepath):
    """Write a list of dicts to CSV."""
    if not rows:
        print(f"  No data to write for {filepath}")
        return

    # Collect all keys preserving order
    fieldnames = []
    for row in rows:
        for key in row:
            if key not in fieldnames:
                fieldnames.append(key)

    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    with open(filepath, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"  Wrote {len(rows)} rows to {filepath}")


def main(raw_dir=None, out_dir=None):
    raw_dir = Path(raw_dir) if raw_dir else DEFAULT_RAW_DIR
    out_dir = Path(out_dir) if out_dir else DEFAULT_OUT_DIR

    print(f"Processing data from: {raw_dir}")
    print(f"Output to: {out_dir}")

    # 1. Parse Lookit JSON files
    print("\n--- Lookit JSON files ---")
    lookit_files = sorted(glob.glob(str(raw_dir / "*_frames.json")))
    lookit_sessions = []
    for f in lookit_files:
        print(f"  Reading {os.path.basename(f)}")
        lookit_sessions.append(parse_lookit_json(f))
    print(f"  Found {len(lookit_sessions)} Lookit session(s)")

    # 2. Parse OSF CSV files
    print("\n--- OSF CSV files ---")
    osf_sessions = parse_osf_csvs(str(raw_dir))
    print(f"  Found {len(osf_sessions)} OSF session(s)")
    for key, session in osf_sessions.items():
        print(f"    {key}: {session['files']}")

    # 3. Match and combine
    print("\n--- Matching ---")
    combined, unmatched = match_lookit_to_osf(lookit_sessions, osf_sessions)
    print(f"  Matched: {len(combined)} session(s)")
    for row in combined:
        method = row.get("match_method", "?")
        child = row.get("child_global_id") or row.get("osf_participant_id") or "?"
        print(f"    {child} (matched via {method})")
    if unmatched:
        print(f"  Unmatched Lookit sessions: {len(unmatched)}")
        for u in unmatched:
            print(f"    {u.get('response_uuid')}")

    # 4. Write sessions.csv
    print("\n--- Writing output ---")
    write_csv(combined, str(out_dir / "sessions.csv"))

    # 5. Write trials.csv
    trials = build_trials_table(osf_sessions)
    write_csv(trials, str(out_dir / "trials.csv"))

    print("\nDone!")


if __name__ == "__main__":
    # Allow overriding paths via command line
    raw = sys.argv[1] if len(sys.argv) > 1 else None
    out = sys.argv[2] if len(sys.argv) > 2 else None
    main(raw, out)
