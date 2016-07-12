import re, sys, csv

OCURANCES_DEFAULT = 100

class Predictor():
	def __init__(self):
		self.keys = {
				'a':  'qaz', 
				's': 'wsx', 
				'd': 'edc', 
				'f':'rfvtgb', 
				'j': 'yhnujm', 
				'k': 'ik,', 
				'l': 'ol.', 
				';': 'p;/\'-?', 
				}
		self.m = dict((l, str(k)) for k,v in self.keys.items() for l in v)
		self.data, self.ocurrences = {}, {}
		self.wmatch = re.compile('[^a-z]+')

	def train(self, f):
		reader = csv.reader(f, delimiter=",")
		for row in reader:
			self._learn(str(row[1].strip().lower()), OCURANCES_DEFAULT)

		for key, value in self.keys.items():
			for character in value:
				self._learn(character, OCURANCES_DEFAULT)
			self._learn(key, OCURANCES_DEFAULT)

	def _train_verbs(self, f):
		reader = csv.reader(f, delimiter=",")
		for row in reader:
			for field in row:
				field = field.replace('(', ',')
				field = field.replace(')', '')
				field = field.replace('/', ', ')
				for word in field.split(','):
					self._learn(word.strip().lower(), OCURANCES_DEFAULT)


	def search(self, sequence):
		if not sequence in self.data:
			return []

		results = ([], [])
		for match in self.data[sequence]:
			results[int(len(match) != len(sequence))].append((
				match, self.ocurrences[match]
				))

		import operator
		import collections
		results = dict(results[0])
		sorted_results = collections.OrderedDict(sorted(
			results.items(), key=operator.itemgetter(1), reverse=True)
			)

		return list(sorted_results.keys())


	def learn(self, word):
		self._learn(word)


	def _learn(self, word, occurences=1):
		if not word in self.ocurrences:
			num = ''.join(self.m[c] for c in word)
			for i in range(1, len(word) + 1):
				inp = num[:i]
				if inp not in self.data:
					self.data[inp] = set([word])
				else:
					self.data[inp].add(word)
		self.ocurrences[word] = self.ocurrences.get(word, 0) + occurences

DefaultPredictor = Predictor()

with open('predictive_text/data/training_data.csv', 'r') as f:
	DefaultPredictor.train(f)

with open('predictive_text/data/verbs.csv', 'r') as f:
	DefaultPredictor._train_verbs(f)
