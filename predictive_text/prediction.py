import re, sys, csv

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
				';': 'p;/\'-', 
				}
		self.m = dict((l, str(k)) for k,v in self.keys.items() for l in v)
		self.data, self.ocurrences = {}, {}
		self.wmatch = re.compile('[^a-z]+')

	def train(self, f):
		reader = csv.reader(f, delimiter=",")
		for row in reader:
			self._learn(str(row[1].strip().lower()))

		for key, value in self.keys.items():
			for character in value:
				self._learn(character)
			self._learn(key)

	def _train_verbs(self, f):
		reader = csv.reader(f, delimiter=",")
		for row in reader:
			for field in row:
				field = field.replace('(', ',')
				field = field.replace(')', '')
				field = field.replace('/', ', ')
				for word in field.split(','):
					self._learn(word.strip().lower())


	def search(self, n):
		if not n in self.data:
			return []

		results = ([], [])
		for match in self.data[n]:
			results[int(len(match) != len(n))].append((match, self.ocurrences[match]))
		return list(dict(results[0]).keys())


	def _learn(self, word):
		if not word in self.ocurrences:
			num = ''.join(self.m[c] for c in word)
			for i in range(1, len(word) + 1):
				inp = num[:i]
				if inp not in self.data:
					self.data[inp] = set([word])
				else:
					self.data[inp].add(word)
		self.ocurrences[word] = 1

DefaultPredictor = Predictor()

with open('predictive_text/data/training_data.csv', 'r') as f:
	DefaultPredictor.train(f)

with open('predictive_text/data/verbs.csv', 'r') as f:
	DefaultPredictor._train_verbs(f)
