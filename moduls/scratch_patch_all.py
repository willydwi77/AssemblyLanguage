import re
import os

files = [
    'd:/PROJECTS/Assembly Language/control_flow_guide.html',
    'd:/PROJECTS/Assembly Language/memory_guide.html',
    'd:/PROJECTS/Assembly Language/pe_iat_eat_guide.html',
    'd:/PROJECTS/Assembly Language/cpp_vs_asm_guide.html'
]

# Emojis used in the project (various)
emoji_pattern = re.compile(
    u"("
    u"\ud83c[\udf00-\udfff]|"
    u"\ud83d[\udc00-\ude4f\ude80-\udeff]|"
    u"[\u2600-\u26FF\u2700-\u27BF]|"
    u"\ud83e[\udd00-\uddff]"
    u")+",
    re.UNICODE)

for f in files:
    if not os.path.exists(f):
        continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # 1. Replace <style> block with CSS/JS links
    content = re.sub(
        r'<style>.*?</style>',
        '<link rel="stylesheet" href="style.css" />\n  <script src="app.js"></script>',
        content, flags=re.DOTALL
    )
    
    # 2. Container
    content = re.sub(r'<div class="max-w(-\w+)?(\[.*?\])? mx-auto.*?>', '<div class="main-container">', content)
    
    # 3. Typography classes
    # Title
    content = re.sub(r'class="text-2xl title-text.*?"', 'class="page-title"', content)
    # Subtitle
    content = re.sub(r'class="text-slate-500 text-sm.*?"', 'class="page-subtitle"', content)
    # Section title
    content = re.sub(r'class="text-xl title-text.*?"', 'class="section-title"', content)
    # Content desc
    content = re.sub(r'class="text-sm text-slate-600.*?leading-relaxed.*?"', 'class="content-desc"', content)
    
    # 4. Remove emojis from tabs, h1, h2, h3, div headers
    # A bit manual to avoid destroying HTML tags. 
    # Just strip emojis globally, since there's no reason to have emojis anywhere if the user wants them gone from headers/tabs.
    # Wait, if they are in the content, maybe they should be removed too. "hilangkan penggunaan emoji dalam setiap index tab tersebut", "serta hilangkan penggunaan emoji".
    content = emoji_pattern.sub('', content)
    # Cleanup possible left-over spaces from emoji removal
    content = content.replace('  ', ' ')
    content = content.replace('> ', '>')
    content = content.replace(' <', '<')
    
    # 5. Tables
    content = content.replace('class="custom-table', 'class="op-table')
    content = content.replace('class="table-auto', 'class="op-table')
    
    # 6. Global JS cleanup for currentArch / setArch if present
    content = re.sub(r'let currentArch = [\'"].*?[\'"];\n', '', content)
    content = re.sub(r'function setArch\(.*?\).*?}\n', '', content, flags=re.DOTALL)
    content = re.sub(r'function archData\(.*?\).*?}\n', '', content, flags=re.DOTALL)
    
    # 7. JS active tab cleanup
    content = content.replace(
        '''    document.querySelectorAll('#mainTabs .tab-btn').forEach(b => b.classList.remove('active'));\n    btn.classList.add('active');''',
        '    if (typeof setActiveTabUI === "function") setActiveTabUI(btn);\n    else { document.querySelectorAll("#mainTabs .tab-btn").forEach(b => b.classList.remove("active")); btn.classList.add("active"); }'
    )

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Done patching.")
