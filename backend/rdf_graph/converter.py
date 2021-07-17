from csvwlib import CSVWConverter


class Converter():
    def csv_to_ttl(self):
        result = CSVWConverter.to_rdf(
            "https://github.com/DeFacto/FactBench/blob/master/files/dbpedia/dbpedia_004.csv", format="ttl")
        # print(result)
        return 'converter'
