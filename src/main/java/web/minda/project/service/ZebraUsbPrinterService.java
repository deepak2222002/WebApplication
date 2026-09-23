package web.minda.project.service;

import javax.print.*;
import javax.print.attribute.DocAttributeSet;
import javax.print.attribute.HashDocAttributeSet;
import javax.print.attribute.standard.DocumentName;
import javax.print.attribute.standard.PrintQuality;
import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Service;

@Service
public class ZebraUsbPrinterService {

    public void printZpl(String printerName, String zpl) {
        try {
            PrintService[] services = PrintServiceLookup.lookupPrintServices(null, null);
            
            
            System.out.println("Available printers:");
            
            for (PrintService service : services) {
                System.out.println(service.getName());
            }

            PrintService zebraPrinter = null;
            for (PrintService service : services) {
                if (service.getName().equalsIgnoreCase(printerName)) {
                    zebraPrinter = service;
                    break;
                }
            }

            if (zebraPrinter == null) {
                throw new RuntimeException("Printer not found: " + printerName);
            }

            DocPrintJob job = zebraPrinter.createPrintJob();

            byte[] bytes = zpl.getBytes(StandardCharsets.UTF_8);
            DocFlavor flavor = DocFlavor.BYTE_ARRAY.AUTOSENSE;

            DocAttributeSet attrs = new HashDocAttributeSet();
            attrs.add(new DocumentName("ZPL Label", null));

            Doc doc = new SimpleDoc(bytes, flavor, attrs);
            job.print(doc, null);

        } catch (Exception e) {
            throw new RuntimeException("USB Print failed", e);
        }
    }
}
