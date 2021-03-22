using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Text;
using System.Linq;
using System.Text;
using System.IO;


using Winnovative;
using Winnovative.WnvHtmlConvert;
using Winnovative.WnvHtmlConvert.PdfDocument;

using tiendapome.Entidades;

namespace tiendapome.Impresion
{

    public class ProcesadorPDF
    {

        private string CantidadPaginas = string.Empty;
        private bool PaginaVaciaAgregada = false;

        public bool MostrarEncabezado { get; set; }
        public bool MostrarPieDePagina { get; set; }
        public float AltoEncabezado { get; set; }
        public float AltoPieDePagina { get; set; }
        public bool TextoPieDePagina { get; set; }
        public string PathFuente { get; set; }

        public ProcesadorPDF()
        {
            MostrarEncabezado = true;
            MostrarPieDePagina = true;
            AltoEncabezado = 80;
            AltoPieDePagina = 20;
            TextoPieDePagina = false;
        }

        public byte[] ProcesarTemplate(string htmlOutput)
        {
            PdfConverter pdfConverter = this.CreatePdfConverter();

            //Document _docPdf = CrearDocumentoPDF(pdfConverter, htmlOutput);
            Document _docPdf = pdfConverter.GetPdfDocumentObjectFromHtmlString(htmlOutput);

            //byte[] bytePDF = pdfConverter.GetPdfBytesFromHtmlString(htmlOutput);

            byte[] bytePDF;
            try
            {
                bytePDF = _docPdf.Save();
            }
            finally
            {
                _docPdf.Close();
            }

            return bytePDF;
        }

        public byte[] ProcesarTemplate(List<string> listHtmlOutput)
        {
            PdfConverter pdfConverter = this.CreatePdfConverter();
            List<Document> listDocuments = new List<Document>();

            foreach (string html in listHtmlOutput)
            {
                //Document _docPdf = CrearDocumentoPDF(pdfConverter, html, string.Empty);

                Document _docPdf = pdfConverter.GetPdfDocumentObjectFromHtmlString(html);

                PrivateFontCollection pfc = new PrivateFontCollection();
                pfc.AddFontFile(string.Format("{0}\\Verdana.ttf", PathFuente));
                _docPdf.AddFont(new Font(pfc.Families[0], 12.0f), true);
                listDocuments.Add(_docPdf);
            }

            int indice = 0;
            Document mergedDocument = listDocuments[indice];
            mergedDocument.AutoCloseAppendedDocs = true;
            foreach (Document _docItem in listDocuments)
            {
                if (indice > 0)
                    mergedDocument.AppendDocument(_docItem);

                indice++;
            }

            mergedDocument.RemovePage(0);
            mergedDocument.RemovePage(0);

            byte[] bytPdfMerged = null;
            try
            {
                bytPdfMerged = mergedDocument.Save();
            }
            finally
            {
                mergedDocument.Close();
            }

            return bytPdfMerged;
        }

        public Document ProcesarDocumentoPDF(string htmlOutput)
        {
            PdfConverter pdfConverter = this.CreatePdfConverter();
            return CrearDocumentoPDF(pdfConverter, htmlOutput);
        }

        public Document ProcesarDocumentoPDF(List<string> listHtmlOutput)
        {
            PdfConverter pdfConverter = this.CreatePdfConverter();
            List<Document> listDocuments = new List<Document>();

            foreach (string html in listHtmlOutput)
            {
                //esta es la version que imprime con la fuente distorsionada
                //Document _docPdf = CrearDocumentoPDF(pdfConverter, html, string.Empty);

                string htmlOutput = html;
                HtmlTag tag;
                HtmlParser parse = new HtmlParser(htmlOutput);

                if (pdfConverter.PdfDocumentOptions.ShowFooter)
                {
                    if (!TextoPieDePagina)
                    {
                        this.AddFooter(pdfConverter);
                    }
                    else
                    {
                        while (parse.ParseNext("iframe", out tag))
                        {
                            // See if this anchor links to us
                            string visibleOnFooterValue;
                            bool _visibleOnFooterValue = false;
                            if (!string.IsNullOrEmpty(tag.Content))
                            {
                                //htmlOutput = htmlOutput.Remove(tag.PostStart, tag.PostEnd);
                                if (tag.Attributes.TryGetValue("visibleonfooter", out visibleOnFooterValue))
                                {
                                    if (bool.TryParse(visibleOnFooterValue, out _visibleOnFooterValue))
                                    {
                                        if (_visibleOnFooterValue)
                                        {
                                            this.AddFooter(pdfConverter, tag.Content);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                parse = new HtmlParser(htmlOutput);
                while (parse.ParseNext("iframe", out tag))
                {
                    // See if this anchor links to us
                    string visibleOnHeaderValue;
                    bool _visibleOnHeaderValue = false;
                    if (!string.IsNullOrEmpty(tag.Content))
                    {
                        htmlOutput = htmlOutput.Remove(tag.PostStart, tag.PostEnd);
                        if (tag.Attributes.TryGetValue("visibleonheader", out visibleOnHeaderValue))
                        {
                            if (bool.TryParse(visibleOnHeaderValue, out _visibleOnHeaderValue))
                            {
                                if (_visibleOnHeaderValue)
                                {
                                    AddHeader(pdfConverter, tag.Content);
                                    break;
                                }
                            }
                        }
                    }
                }

                //PrivateFontCollection pfc = new PrivateFontCollection();
                //pfc.AddFontFile(string.Format("{0}\\Verdana.ttf", PathFuente));

                Document _docPdf = pdfConverter.GetPdfDocumentObjectFromHtmlString(html);

                //_docPdf.AddFont(new Font(pfc.Families[0], 12.0f), true);

                listDocuments.Add(_docPdf);
            }

            int indice = 0;
            Document mergedDocument = listDocuments[indice];
            mergedDocument.AutoCloseAppendedDocs = true;
            foreach (Document _docItem in listDocuments)
            {
                if (indice > 0)
                    mergedDocument.AppendDocument(_docItem);

                indice++;
            }

            return mergedDocument;
        }

        private PdfConverter CreatePdfConverter()
        {
            // create the PDF converter
            PdfConverter pdfConverter = new PdfConverter();

            pdfConverter.LicenseKey = "V3xld2Zid2Zld2B5Z3dkZnlmZXlubm5u";
            pdfConverter.PdfDocumentInfo.AuthorName = "pome.SysGEIC";
            pdfConverter.PdfDocumentInfo.Title = "PDF Info.";
            pdfConverter.PdfDocumentInfo.Subject = "Generador de documentos";
            pdfConverter.PdfDocumentInfo.Keywords = "Generador de documentos";
            pdfConverter.PdfDocumentInfo.CreatedDate = DateTime.Now;


            //////////// set if the generated PDF contains selectable text or an embedded image - default value is true
            bool _bGenerateSelectablePdf = true;
            pdfConverter.PdfDocumentOptions.GenerateSelectablePdf = _bGenerateSelectablePdf;

            ////////////set the PDF page size 
            //////////string[] listpdfFormats = Enum.GetNames(typeof(PdfPageSize));
            string _pdfFormatsSelected = PdfPageSize.A4.ToString();
            pdfConverter.PdfDocumentOptions.PdfPageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), _pdfFormatsSelected);

            //////////// set the PDF compression level
            //////////string[] listpdfCompressionLevels = Enum.GetNames(typeof(PdfCompressionLevel));
            string _pdfCompressionLevelSelected = PdfCompressionLevel.Best.ToString();
            pdfConverter.PdfDocumentOptions.PdfCompressionLevel = (PdfCompressionLevel)Enum.Parse(typeof(PdfCompressionLevel), _pdfCompressionLevelSelected);

            //////////// set the PDF page orientation (portrait or landscape)
            //////////string[] listpdfPageOrientations = Enum.GetNames(typeof(PDFPageOrientation));
            string _pdfPageOrientationSelected = PDFPageOrientation.Portrait.ToString();
            pdfConverter.PdfDocumentOptions.PdfPageOrientation = (PDFPageOrientation)Enum.Parse(typeof(PDFPageOrientation), _pdfPageOrientationSelected);

            //////// embed the true type fonts in the generated PDF document
            bool _bEmbedFonts = true;
            pdfConverter.PdfDocumentOptions.EmbedFonts = _bEmbedFonts;


            ////////////set the PDF standard used to generate the PDF document
            pdfConverter.PdfStandardSubset = GetPdfStandard("PDF");


            //////////// set PDF options
            pdfConverter.PageWidth = 0; // autodetect the HTML page width
            pdfConverter.PageHeight = 0;

            //////// set if the HTML content is resized if necessary to fit the PDF page width - default is true
            bool _bFitWidth = true;
            pdfConverter.PdfDocumentOptions.FitWidth = _bFitWidth;
            pdfConverter.PdfDocumentOptions.StretchToFit = _bFitWidth;

            bool _bFitHeight = false;
            pdfConverter.PdfDocumentOptions.FitHeight = _bFitHeight;

            //////// set if the PDF page should be automatically resized to the size of the HTML content when FitWidth is false
            pdfConverter.PdfDocumentOptions.AutoSizePdfPage = false;


            pdfConverter.PdfDocumentOptions.ShowHeader = MostrarEncabezado;
            pdfConverter.PdfDocumentOptions.ShowFooter = MostrarPieDePagina;

            ////////////set the PDF document margins
            int _iLeftMargin = 20;
            int _iRightMargin = 20;
            int _iTopMargin = 10;
            int _iBottomMargin = 10;
            pdfConverter.PdfDocumentOptions.LeftMargin = _iLeftMargin;
            pdfConverter.PdfDocumentOptions.RightMargin = _iRightMargin;
            pdfConverter.PdfDocumentOptions.TopMargin = _iTopMargin;
            pdfConverter.PdfDocumentOptions.BottomMargin = _iBottomMargin;

            return pdfConverter;
        }

        private Document CrearDocumentoPDF(PdfConverter pdfConverter, string htmlOutput)
        {
            //realizo una primera conversion del html.
            byte[] byteArray = pdfConverter.GetPdfBytesFromHtmlString(htmlOutput);

            pdfConverter.PostConvertActionEvent += new PostConvertActionHandler(this.pdfConverter_PostConvertActionEvent2);
            Document result = pdfConverter.GetPdfDocumentObjectFromHtmlString(htmlOutput);
            pdfConverter.PostConvertActionEvent -= this.pdfConverter_PostConvertActionEvent2;

            return result;
        }

        private Document CrearDocumentoPDF(PdfConverter pdfConverter, string htmlOutput, string textFooterOpt)
        {
            //Creo el evento, PostConvert, para detectar la cantidad de paginas, luego de agregar Footer y Header.
            pdfConverter.PostConvertActionEvent += new PostConvertActionHandler(this.pdfConverter_PostConvertActionEvent);


            HtmlTag tag;
            HtmlParser parse = new HtmlParser(htmlOutput);

            if (pdfConverter.PdfDocumentOptions.ShowFooter)
            {
                if (!TextoPieDePagina)
                {
                    this.AddFooter(pdfConverter);
                }
                else
                {
                    while (parse.ParseNext("iframe", out tag))
                    {
                        // See if this anchor links to us
                        string visibleOnFooterValue;
                        bool _visibleOnFooterValue = false;
                        if (!string.IsNullOrEmpty(tag.Content))
                        {
                            //htmlOutput = htmlOutput.Remove(tag.PostStart, tag.PostEnd);
                            if (tag.Attributes.TryGetValue("visibleOnFooter", out visibleOnFooterValue))
                            {
                                if (bool.TryParse(visibleOnFooterValue, out _visibleOnFooterValue))
                                {
                                    if (_visibleOnFooterValue)
                                    {
                                        this.AddFooter(pdfConverter, tag.Content);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            parse = new HtmlParser(htmlOutput);
            while (parse.ParseNext("iframe", out tag))
            {
                // See if this anchor links to us
                string visibleOnHeaderValue;
                bool _visibleOnHeaderValue = false;
                if (!string.IsNullOrEmpty(tag.Content))
                {
                    htmlOutput = htmlOutput.Remove(tag.PostStart, tag.PostEnd);
                    if (tag.Attributes.TryGetValue("visibleOnHeader", out visibleOnHeaderValue))
                    {
                        if (bool.TryParse(visibleOnHeaderValue, out _visibleOnHeaderValue))
                        {
                            if (_visibleOnHeaderValue)
                            {
                                AddHeader(pdfConverter, tag.Content);
                                break;
                            }
                        }
                    }
                }
            }

            //realizo una primera conversion del html.
            //byte[] byteArray = pdfConverter.GetPdfBytesFromHtmlString(htmlOutput);
            Document result1 = pdfConverter.GetPdfDocumentObjectFromHtmlString(htmlOutput);

            //elimino el evento PostConvert, ya que no necesito realizar otra consulta en el PDF.
            pdfConverter.PostConvertActionEvent -= this.pdfConverter_PostConvertActionEvent;

            //En caso de que la primera conversion, retorne nro impart de paginas, me veo obligado a agregar una pagina mas en blanco.
            int _cantidad = 0;
            PaginaVaciaAgregada = false;
            if (int.TryParse(CantidadPaginas, out _cantidad))
            {
                if (_cantidad % 2 != 0)
                {
                    //cantidad impar.
                    //agregamos un salto de pagina, para imprimir el otro cuerpo en hoja aparte.
                    htmlOutput += "<div style=\"page-break-before: always\">&nbsp;</div>";
                    //Imprimo en la hoja, la numeracion, par.
                    _cantidad += 1;
                    PaginaVaciaAgregada = true;
                }
            }

            // reemplazo el tag de cantidad de paginas, con la variable inicializada en el evento postConvert.
            htmlOutput = htmlOutput.Replace("[{cantidadhojas}]", _cantidad.ToString());

            //realizo la conversion definitiva.
            pdfConverter.PostConvertActionEvent += new PostConvertActionHandler(this.pdfConverter_PostConvertActionEvent2);
            Document result = pdfConverter.GetPdfDocumentObjectFromHtmlString(htmlOutput);

            pdfConverter.PostConvertActionEvent -= this.pdfConverter_PostConvertActionEvent2;

            return result;
        }

        private void pdfConverter_PostConvertActionEvent(PostConvertActionEventArgs pcaEventArgs)
        {
            Document pdfDocument = pcaEventArgs.PdfDocument as Document;
            ConversionSummary conversionSummary = pcaEventArgs.ConversionSummary as ConversionSummary;
            PdfConverter pdfConverter = pcaEventArgs.PdfConverter as PdfConverter;

            //inicializo la variable con la cantidad de pagina del pdf.
            CantidadPaginas = conversionSummary.PdfPageCount.ToString();
        }

        private void pdfConverter_PostConvertActionEvent2(PostConvertActionEventArgs pcaEventArgs)
        {
            Document pdfDocument = pcaEventArgs.PdfDocument as Document;
            ConversionSummary conversionSummary = pcaEventArgs.ConversionSummary as ConversionSummary;
            PdfConverter pdfConverter = pcaEventArgs.PdfConverter as PdfConverter;

            //inicializo la variable con la cantidad de pagina del pdf.
            if (((conversionSummary.PdfPageCount % 2) != 0) && (PaginaVaciaAgregada))
                pdfDocument.RemovePage(conversionSummary.LastPageIndex);

        }

        private PdfStandardSubset GetPdfStandard(string standardName)
        {
            switch (standardName)
            {
                case "PDF":
                    return PdfStandardSubset.Full;
                case "PDF/A":
                    return PdfStandardSubset.Pdf_A_1b;
                case "PDF/X":
                    return PdfStandardSubset.Pdf_X_1a;
                case "PDF/SiqQA":
                    return PdfStandardSubset.Pdf_SiqQ_a;
                case "PDF/SiqQB":
                    return PdfStandardSubset.Pdf_SiqQ_b;
                default:
                    return PdfStandardSubset.Full;

            }
        }

        private void AddFooter(PdfConverter pdfConverter)
        {
            string numeradorPaginaHtml = "Pagina &p; de &P; ";

            // set the footer height in points
            pdfConverter.PdfFooterOptions.FooterHeight = 20;
            pdfConverter.PdfFooterOptions.FooterTextYLocation = 0;
            pdfConverter.PdfFooterOptions.DrawFooterLine = true;
            pdfConverter.PdfFooterOptions.ShowPageNumber = true;

            //TODO
            pdfConverter.PdfFooterOptions.PageNumberingFormatString = numeradorPaginaHtml;
            pdfConverter.PdfFooterOptions.PageNumberText = numeradorPaginaHtml;
            pdfConverter.PdfFooterOptions.PageNumberTextColor = Color.Black;
            pdfConverter.PdfFooterOptions.PageNumberTextFontName = (new System.Drawing.FontFamily("Calibri")).GetName(0);
            pdfConverter.PdfFooterOptions.PageNumberTextFontSize = 9;
            pdfConverter.PdfFooterOptions.PageNumberTextFontStyle = FontStyle.Regular;
            pdfConverter.PdfFooterOptions.PageNumberYLocation = 0;


        }

        private void AddFooter(PdfConverter pdfConverter, string textOnFooter)
        {
            string numeradorPaginaHtml = "Pagina &p; de &P; ";

            // set the footer height in points
            pdfConverter.PdfFooterOptions.FooterHeight = AltoPieDePagina;
            pdfConverter.PdfFooterOptions.DrawFooterLine = true;
            pdfConverter.PdfFooterOptions.ShowPageNumber = true;
            pdfConverter.PdfFooterOptions.FooterTextYLocation = 0;

            pdfConverter.PdfFooterOptions.HtmlToPdfArea = new HtmlToPdfArea(0, 0, -1, -1, textOnFooter, "", -1, -1);
            pdfConverter.PdfFooterOptions.HtmlToPdfArea.FitHeight = true;
            pdfConverter.PdfFooterOptions.HtmlToPdfArea.EmbedFonts = true;
            pdfConverter.PdfFooterOptions.HtmlToPdfArea.ScriptsEnabledInImage = true;
            pdfConverter.PdfFooterOptions.HtmlToPdfArea.HtmlViewerHeight = int.Parse(AltoPieDePagina.ToString());

            //TODO
            pdfConverter.PdfFooterOptions.PageNumberingFormatString = numeradorPaginaHtml;
            pdfConverter.PdfFooterOptions.PageNumberText = numeradorPaginaHtml;
            pdfConverter.PdfFooterOptions.PageNumberTextColor = Color.Black;
            pdfConverter.PdfFooterOptions.PageNumberTextFontName = (new System.Drawing.FontFamily("Calibri")).GetName(0);
            pdfConverter.PdfFooterOptions.PageNumberTextFontSize = 9;
            pdfConverter.PdfFooterOptions.PageNumberTextFontStyle = FontStyle.Regular;
            pdfConverter.PdfFooterOptions.PageNumberYLocation = 4;

        }

        private void AddHeader(PdfConverter pdfConverter, string headerHtml)
        {
            pdfConverter.PdfDocumentOptions.ShowHeader = true;
            pdfConverter.PdfHeaderOptions.DrawHeaderLine = false;
            pdfConverter.PdfHeaderOptions.HeaderHeight = AltoEncabezado;
            //pdfConverter.PdfHeaderOptions.HtmlToPdfArea = new HtmlToPdfArea(0, 0, -1, pdfConverter.PdfHeaderOptions.HeaderHeight, headerHtml, "", 2024,0);
            pdfConverter.PdfHeaderOptions.HtmlToPdfArea = new HtmlToPdfArea(0, 0, -1, -1, headerHtml, "", -1, -1);
            pdfConverter.PdfHeaderOptions.HtmlToPdfArea.FitHeight = true;
            pdfConverter.PdfHeaderOptions.HtmlToPdfArea.EmbedFonts = true;
            pdfConverter.PdfHeaderOptions.HtmlToPdfArea.ScriptsEnabledInImage = true;
            pdfConverter.PdfHeaderOptions.HtmlToPdfArea.HtmlViewerHeight = int.Parse(AltoEncabezado.ToString());
        }

        private string getMergeString(List<string> _lst)
        {
            //una vez finalizado el proceso, escribo en memoria todos los html restantes.
            StringWriter writer = new StringWriter();
            foreach (string html in _lst)
            {
                writer.WriteLine(html);
            }
            string htmlOutput = writer.ToString();
            writer.Dispose();
            writer = null;
            return htmlOutput;
        }

    }

}
