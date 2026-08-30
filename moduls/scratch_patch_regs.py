import re
import os

with open('d:/PROJECTS/Assembly Language/cpp_asm_data.js', 'r', encoding='utf-8') as f:
    content = f.read()

def process_regs(match):
    regs_str = match.group(1)
    # Parse existing regs
    existing = {}
    for pair in regs_str.split(','):
        if ':' in pair:
            k, v = pair.split(':', 1)
            k = k.strip().strip('"').strip("'")
            v = v.strip().strip('"').strip("'")
            existing[k] = v
            
    is_x64 = 'rax' in existing or 'rsp' in existing
    
    # Define standard
    if is_x64:
        std_keys = ['rax', 'rbx', 'rcx', 'rdx', 'rbp', 'rsp', 'rsi', 'rdi', 'rflags']
    else:
        std_keys = ['eax', 'ebx', 'ecx', 'edx', 'ebp', 'esp', 'esi', 'edi', 'eflags']
        
    final_regs = []
    for k in std_keys:
        val = existing.get(k, "0x00")
        
        # provide realistic defaults if 0x00
        if k == 'rsp' and val == '0x00': val = '0x00007FFFFFFFE000'
        if k == 'esp' and val == '0x00': val = '0x00402000'
        if k == 'rflags' and val == '0x00': val = '[ ZF=0 SF=0 ]'
        if k == 'eflags' and val == '0x00': val = '[ ZF=0 SF=0 ]'
            
        final_regs.append(f'"{k}": "{val}"')
        
    return 'regs: { ' + ', '.join(final_regs) + ' }'

# regex to find regs dictionary
new_content = re.sub(r'regs:\s*\{\s*(.*?)\s*\}', process_regs, content)

with open('d:/PROJECTS/Assembly Language/cpp_asm_data.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("cpp_asm_data.js patched.")

# Also do the same for debugger_panel.html since it has dummyData
with open('d:/PROJECTS/Assembly Language/debugger_panel.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

new_html_content = re.sub(r'regs:\s*\{\s*(.*?)\s*\}', process_regs, html_content)
with open('d:/PROJECTS/Assembly Language/debugger_panel.html', 'w', encoding='utf-8') as f:
    f.write(new_html_content)

print("debugger_panel.html patched.")
