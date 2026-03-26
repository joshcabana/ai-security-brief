#!/usr/bin/env python3
"""Update the AI Threat Brief completion guide HTML to reflect current task status.
Run: python3 scripts/update-completion-guide.py ~/Downloads/ai-threat-brief-completion-guide.html
"""
import re
import sys
import os
from pathlib import Path

DEFAULT_PATH = Path.home() / 'Downloads' / 'ai-threat-brief-completion-guide.html'

def update_guide(path: Path) -> None:
    html = path.read_text(encoding='utf-8')
    original = html

    # 1. Stats card: 5 tasks -> 4 tasks
    html = re.sub(r'(>)5 tasks(<)', r'\g<1>4 tasks\g<2>', html)

    # 2. Stats card: ~35 min -> ~30 min
    html = html.replace('~35 min total', '~30 min total')

    # 3. Task 1 section badge: ACTION REQUIRED -> COMPLETE (green)
    # Match the badge span immediately before 'Task 1' heading
    html = re.sub(
        r'(<span[^>]*>\s*ACTION REQUIRED\s*</span>)(\s*)(Task 1: Send First Newsletter via Beehiiv)',
        r'<span style="background:#166534;color:#dcfce7;font-size:10px;font-weight:700;letter-spacing:.12em;padding:3px 10px;border-radius:4px;text-transform:uppercase;">\u2713 COMPLETE</span>\2\3',
        html
    )

    # 4. Task 1 card title
    html = html.replace('Publish Issue #5 from draft', 'Issue #5 Published \u2014 Live on Beehiiv')

    # 5. Task 1 time/priority badge
    html = re.sub(r'~5 min\s*\xb7\s*HIGH PRIORITY', 'DONE \u00b7 26 Mar 2026 1:19 PM AEDT', html)

    # 6. Task 1 description text
    html = re.sub(
        r'Your newsletter infrastructure is fully wired.*?subscriber list\.',
        'Newsletter published 26 March 2026 at 1:19\u202fPM AEDT. '
        'Post: \u201cYour IDE can execute arbitrary code \u2014 and AI tools are the entry point.\u201d '
        'Sent to all free subscribers via Email and Web. '
        '<a href=\"https://app.beehiiv.com/posts/83e59c21-6673-413e-a1d4-53fdd632fe1c\" '
        'style=\"color:inherit;\">View post on Beehiiv \u2192</a>',
        html,
        flags=re.DOTALL
    )

    # 7. "YOU ARE HERE" roadmap note
    html = html.replace(
        'Complete the 5 manual tasks above.',
        'Complete the 4 remaining manual tasks. \u2705 Task 1 done: newsletter published 26 Mar.'
    )

    # 8. Update analysis timestamp
    html = re.sub(
        r'Analysis generated \d+ \w+ \d+',
        'Analysis generated 26 March 2026 (updated 26 March 2026 \u2014 Task 1 complete)',
        html
    )

    if html == original:
        print('WARNING: No changes made. File may already be updated or patterns did not match.')
    else:
        path.write_text(html, encoding='utf-8')
        changes = sum([
            html.count('4 tasks') != original.count('4 tasks'),
            html.count('30 min') != original.count('30 min'),
            'COMPLETE' in html and 'COMPLETE' not in original,
            'Published' in html and 'Publish Issue' not in html,
        ])
        print(f'Updated {path}')
        print(f'Changes applied: {changes} sections updated')

if __name__ == '__main__':
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PATH
    if not target.exists():
        print(f'ERROR: File not found: {target}')
        sys.exit(1)
    update_guide(target)
