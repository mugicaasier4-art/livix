import pandas as pd
import os

def export_to_excel():
    matrix_file = "LIVIX_ULTIMATE_TIKTOK_90DAY_PLAN.csv"
    output_file = "LIVIX_TIKTOK_MASTER_PLAN_COMPLETE.xlsx"
    downloads_path = os.path.expanduser("~/Downloads")
    final_destination = os.path.join(downloads_path, output_file)

    # Content for other sheets (Simplified for Excel)
    roadmap_content = [
        ["Mes 1", "Fase de Descubrimiento (Viral Loops)", "80% Viral / 20% Valor", "Reproducciones / Nuevos Seguidores"],
        ["Mes 2", "Fase de Autoridad (Value Stacking)", "60% Valor / 30% Viral / 10% Prod", "Engagement (Saves/Shares)"],
        ["Mes 3", "Fase de Adquisición (Conversion Engine)", "40% Producto / 40% Valor / 20% Viral", "Descargas App / Registros"]
    ]
    
    sop_content = [
        ["Categoria", "Detalle", "Especificacion"],
        ["Iluminacion", "Key Light + Rim Light", "Suave a 45 grados + Contra de color de marca"],
        ["Camara", "Resolucion", "4K a 60fps (Lente trasera siempre)"],
        ["Audio", "Microfonia", "Lavalier o Audio externo cerca de boca"],
        ["Edicion", "Regla 2 Segundos", "Cambio visual cada 2s para maxima retencion"],
        ["Captions", "Hormozi Style", "Negrita, resaltar 1-2 palabras clave en color"]
    ]

    hooks_vault = [
        ["Tipo", "Hook (El Gancho)"],
        ["Curiosidad", "Zaragoza tiene un secreto que los portales no quieren que sepas..."],
        ["Curiosidad", "3 Red Flags en un contrato de alquiler que ignoras."],
        ["Curiosidad", "Cómo vivir en el Actur por el precio de Delicias."],
        ["Miedo", "No firmes un contrato sin ver esto antes."],
        ["Relatabilidad", "POV: Tu compañero se deja la luz encendida..."],
        ["Ahorro", "Cómo ahorrar 200€ al mes siendo estudiante."],
        ["Autoridad", "He analizado 500 pisos en ZGZ y he encontrado esto..."]
    ]

    # Create Excel with multiple sheets
    with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
        # Sheet 1: 90 Day Matrix
        df_matrix = pd.read_csv(matrix_file)
        df_matrix.to_excel(writer, index=False, sheet_name='🗓️ Plan 90 Dias')
        
        # Sheet 2: Strategy Roadmap
        df_roadmap = pd.DataFrame(roadmap_content, columns=["Periodo", "Fase", "Mix Contenido", "KPI Principal"])
        df_roadmap.to_excel(writer, index=False, sheet_name='🚀 Estrategia')
        
        # Sheet 3: Production SOP
        df_sop = pd.DataFrame(sop_content[1:], columns=sop_content[0])
        df_sop.to_excel(writer, index=False, sheet_name='🎬 Produccion SOP')
        
        # Sheet 4: Script Hooks
        df_hooks = pd.DataFrame(hooks_vault[1:], columns=hooks_vault[0])
        df_hooks.to_excel(writer, index=False, sheet_name='🪝 Boveda Ganchos')

        # Formatting
        workbook = writer.book
        from openpyxl.styles import Font, PatternFill, Alignment

        for sheet in workbook.worksheets:
            # Format headers
            header_font = Font(bold=True, color="FFFFFF")
            header_fill = PatternFill(start_color="111111", end_color="111111", fill_type="solid")
            for cell in sheet[1]:
                cell.font = header_font
                cell.fill = header_fill
                cell.alignment = Alignment(horizontal="center")
            
            # Auto-adjust width
            for column in sheet.columns:
                max_length = 0
                column_letter = column[0].column_letter
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length: max_length = len(str(cell.value))
                    except: pass
                sheet.column_dimensions[column_letter].width = min(max_length + 2, 60)

    # Move to Downloads
    import shutil
    shutil.move(output_file, final_destination)
    print(f"¡Master Plan consolidado en: {final_destination}")

if __name__ == "__main__":
    try:
        export_to_excel()
    except Exception as e:
        print(f"Ocurrió un error: {e}")
