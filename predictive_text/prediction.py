import re, sys

class Predictor():
    def __init__(self):
        keys = {
                'a':  'qaz', 
                's': 'wsx', 
                'd': 'edc', 
                'f':'rfvtgb', 
                'j': 'yhnujm', 
                'k': 'ik,', 
                'l': 'ol.', 
                ';': 'p;/', 
                }
        self.m = dict((l, str(k)) for k,v in keys.items() for l in v)
        self.data, self.ocurrences = {}, {}
        self.wmatch = re.compile('[^a-z]+')


    def train(self, f):
        for word in self.wmatch.split(f.read().lower()):
            if word in self.ocurrences:
                self.ocurrences[word] += 1
            else:
                self._learn(word)
                self.ocurrences[word] = 1


    def search(self, n):
        if not n in self.data:
            return []

        results = ([], [])
        for match in self.data[n]:
            results[int(len(match) != len(n))].append((match, self.ocurrences[match]))
            # results[int(len(match) != len(n))].append((match, self.ocurrences[match]))

        print(results)
        k = lambda m: m[1]
        return results[0][0][0]
        # return(
                # sorted(results[0], key=k, reverse=True),
                # sorted(results[1], key=k, reverse=True)
                # )


    def _learn(self, word):
        num = ''.join(self.m[c] for c in word)
        for i in range(1, len(word) + 1):
            inp = num[:i]
            if inp not in self.data:
                self.data[inp] = set([word])
            else:
                self.data[inp].add(word)

# if __name__ == '__main__':
    # with open('alice_in_wonderland.txt', 'r') as f:
        # train(f)
    # results = search(sys.argv[1])


    # for i, t in ((0, 'Exact'), (1, 'Prefix')):
        # print("{0} matches for {1}:".format(t, sys.argv[1]))
        # for match, oc in results[i]:
            # print("Match: {0}".format([match]))

    # if len(results) is 0:
        # print("No matches")
