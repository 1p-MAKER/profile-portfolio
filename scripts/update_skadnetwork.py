import os
import sys

# Script location
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Target file
PLIST_PATH = os.path.abspath(os.path.join(SCRIPT_DIR, '../ios/App/App/Info.plist'))

# SKAdNetwork IDs
SKADNETWORK_IDS = [
  'cstr6suwn9.skadnetwork', 'v9wttpbfk9.skadnetwork', 'n38lu8286q.skadnetwork',
  '4dzt52r2t5.skadnetwork', 'bvpn9n2tp3.skadnetwork', 'ludvb6z3bs.skadnetwork',
  'su67r6k2v3.skadnetwork', '238da6jt44.skadnetwork', '22mmun2rn5.skadnetwork',
  'gta9lk7p23.skadnetwork', 'kbd757ywx3.skadnetwork', 'wzmmz9fp6w.skadnetwork',
  'f38h382jlk.skadnetwork', '4pfyvq9l8r.skadnetwork', 'ecpz2srf59.skadnetwork',
  'v72qych5uu.skadnetwork', '5a6flpkh64.skadnetwork', '9rd848q2bz.skadnetwork',
  'e5fvkxwrpn.skadnetwork', 'p78axxw29g.skadnetwork', 'k674qkevps.skadnetwork',
  '5l3tpt7t6e.skadnetwork', 'av6w8kgt66.skadnetwork', 'uw77j35x4d.skadnetwork',
  'e5fvkxwrpn.skadnetwork', '2u9pt9hc89.skadnetwork', 'n38lu8286q.skadnetwork',
  '5l3tpt7t6e.skadnetwork', '3rd42ekr43.skadnetwork', 'glqzh8vgby.skadnetwork',
  '4fyvq9l8r.skadnetwork', '5tjdwbrq8w.skadnetwork'
]

def generate_array_items():
    unique_ids = sorted(list(set([x.lower() for x in SKADNETWORK_IDS])))
    items = []
    for sk_id in unique_ids:
        items.append(f"\t\t<dict>\n\t\t\t<key>SKAdNetworkIdentifier</key>\n\t\t\t<string>{sk_id}</string>\n\t\t</dict>")
    return "\n".join(items)

def update_plist():
    if not os.path.exists(PLIST_PATH):
        print(f"❌ Info.plist not found at: {PLIST_PATH}")
        return

    with open(PLIST_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    start_tag = '<key>SKAdNetworkItems</key>'
    # Simple logic to find the block
    start_index = content.find(start_tag)

    updated_items = generate_array_items()

    if start_index == -1:
        print("⚠️ SKAdNetworkItems not found. Creating new block...")
        dict_end = '</dict>\n</plist>'
        new_block = f"\t<key>SKAdNetworkItems</key>\n\t<array>\n{updated_items}\n\t</array>\n"
        if dict_end in content:
            content = content.replace(dict_end, new_block + dict_end)
        else:
             print("❌ Could not find end of dict to insert new block.")
             return
    else:
        # Find array start and end
        array_start_tag = '<array>'
        array_end_tag = '</array>'
        
        array_start_index = content.find(array_start_tag, start_index)
        array_end_index = content.find(array_end_tag, array_start_index)
        
        if array_start_index == -1 or array_end_index == -1:
             print("❌ Failed to parse existing SKAdNetworkItems array.")
             return

        before = content[:array_start_index + len(array_start_tag)]
        after = content[array_end_index:]
        content = before + "\n" + updated_items + "\n\t" + after

    with open(PLIST_PATH, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ SKAdNetworkItems updated! Total count: {len(set(SKADNETWORK_IDS))}")

if __name__ == "__main__":
    update_plist()
